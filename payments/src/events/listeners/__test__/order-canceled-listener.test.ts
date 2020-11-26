import { OrderCanceledEvent, OrderStatus } from '@okradzemirian/ticketing-common'
import { Message } from 'node-nats-streaming'
import { Order } from '../../../models/order'
import { natsWrapper } from '../../../nats-wrapper'
import { mongoId } from '../../../test/utils'
import { OrderCanceledListener } from '../order-canceled-listener'

const setup = async () => {
  const listener = new OrderCanceledListener(natsWrapper.client)

  const order = Order.build({
    id: mongoId(),
    status: OrderStatus.Created,
    price: 20,
    userId: mongoId(),
    version: 0,
  })
  await order.save()

  const data: OrderCanceledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: mongoId(),
    },
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg, order }
}

it('updates the status of the order', async () => {
  const { listener, data, msg, order } = await setup()
  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder!.status).toEqual(OrderStatus.Canceled)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})