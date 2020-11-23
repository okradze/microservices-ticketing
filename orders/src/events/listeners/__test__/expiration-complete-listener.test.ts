import { Message } from 'node-nats-streaming'
import { ExpirationCompleteEvent } from '@okradzemirian/ticketing-common'
import { Order, OrderStatus } from '../../../models/order'
import { Ticket } from '../../../models/ticket'
import { natsWrapper } from '../../../nats-wrapper'
import { mongoId } from '../../../test/utils'
import { ExpirationCompleteListener } from '../expiration-complete-listener'

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client)

  const ticket = Ticket.build({
    id: mongoId(),
    title: 'concert',
    price: 20,
  })
  await ticket.save()

  const order = Order.build({
    userId: mongoId(),
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  })
  await order.save()

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, ticket, order, data, msg }
}

it('updates order status to canceled', async () => {
  const { listener, order, data, msg } = await setup()
  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder!.status).toEqual(OrderStatus.Canceled)
})

it('emits OrderCanceled event', async () => {
  const { listener, order, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()

  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
  expect(eventData.id).toEqual(order.id)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})