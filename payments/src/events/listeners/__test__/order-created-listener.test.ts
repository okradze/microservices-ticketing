import { OrderCreatedEvent, OrderStatus } from '@okradzemirian/ticketing-common'
import { Message } from 'node-nats-streaming'
import { Order } from '../../../models/order'
import { natsWrapper } from '../../../nats-wrapper'
import { mongoId } from '../../../test/utils'
import { OrderCreatedListener } from '../order-created-listener'

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)

  const data: OrderCreatedEvent['data'] = {
    id: mongoId(),
    status: OrderStatus.Created,
    expiresAt: 'aslkfj',
    userId: mongoId(),
    version: 0,
    ticket: {
      id: mongoId(),
      price: 20,
    },
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg }
}

it('replicates order info', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  const order = await Order.findById(data.id)
  expect(order!.price).toEqual(data.ticket.price)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})