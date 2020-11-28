import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { requireAuth, validateRequest, BadRequestError, NotFoundError, NotAuthorizedError, OrderStatus } from '@okradzemirian/ticketing-common'
import { Order } from '../models/order'
import { Payment } from '../models/payment'
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher'
import { stripe } from '../stripe'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.post('/api/payments', requireAuth, [
  body('token')
    .not()
    .isEmpty(),
  body('orderId')
    .not()
    .isEmpty(),
], validateRequest, async (req: Request, res: Response) => {
  const { token, orderId } = req.body

  const order = await Order.findById(orderId)
  if(!order) throw new NotFoundError()
  if(order.userId !== req.currentUser!.id) throw new NotAuthorizedError()
  if(order.status === OrderStatus.Canceled) throw new BadRequestError('Order is canceled')

  const charge = await stripe.charges.create({
    currency: 'usd',
    amount: order.price * 100,
    source: token,
  })
  const payment = Payment.build({
    orderId,
    stripeId: charge.id,
  })
  await payment.save()

  new PaymentCreatedPublisher(natsWrapper.client).publish({
    id: payment.id,
    stripeId: payment.stripeId,
    orderId: payment.orderId,
  })

  res.status(201).send({ success: true })
})

export { router as createChargeRouter }