import { Message } from 'node-nats-streaming'
import { Listener, Subjects, ExpirationCompleteEvent } from '@okradzemirian/ticketing-common'
import { queueGroupName } from './queue-group-name'
import { Order, OrderStatus } from '../../models/order'
import { OrderCanceledPublisher } from '../publishers/order-canceled-publisher'
import { natsWrapper } from '../../nats-wrapper'

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
  queueGroupName = queueGroupName

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket')
    if(!order) throw new Error('Order not found')

    order.set({ status: OrderStatus.Canceled })
    await order.save()

    await new OrderCanceledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
      version: order.version,
    })

    msg.ack()
  }
}