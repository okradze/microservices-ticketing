import request from 'supertest'
import { app } from '../../app'
import { mongoId, signin } from '../../test/utils'
import { Order, OrderStatus } from '../../models/order'
import { stripe } from '../../stripe'

jest.mock('../../stripe')

it('returns 404 when purchasing an order does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', signin())
    .send({
      token: 'asdsfa',
      orderId: mongoId(),
    })
    .expect(404)
})

it('returns a 401 when purchasing an order that does not belong to the user', async () => {
  const order = Order.build({
    id: mongoId(),
    status: OrderStatus.Created,
    userId: mongoId(),
    price: 20,
    version: 0,
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', signin())
    .send({
      token: 'asdsfa',
      orderId: order.id,
    })
    .expect(401)
})

it('returns 400 when purchasing a canceled order', async () => {
  const order = Order.build({
    id: mongoId(),
    status: OrderStatus.Canceled,
    userId: mongoId(),
    price: 20,
    version: 1,
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', signin(order.userId))
    .send({
      token: 'asdsfa',
      orderId: order.id,
    })
    .expect(400)
})

it('returns 201 with valid inputs', async () => {
  const order = Order.build({
    id: mongoId(),
    status: OrderStatus.Created,
    userId: mongoId(),
    price: 20,
    version: 0,
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', signin(order.userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201)

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]
  expect(chargeOptions.source).toEqual('tok_visa')
  expect(chargeOptions.amount).toEqual(20 * 100)
  expect(chargeOptions.currency).toEqual('usd')
})