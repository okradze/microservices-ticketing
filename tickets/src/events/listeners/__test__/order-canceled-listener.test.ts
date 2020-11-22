import { Message } from 'node-nats-streaming'
import { OrderCanceledEvent } from '@okradzemirian/ticketing-common'
import { OrderCanceledListener } from '../order-canceled-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'
import { mongoId } from '../../../test/utils'

const setup = async () => {
  const listener = new OrderCanceledListener(natsWrapper.client)

  const orderId = mongoId()
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: mongoId(),
  })
  ticket.set({ orderId })
  await ticket.save()

  const data: OrderCanceledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    }
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg, ticket, orderId }
}

it('updates the ticket, publishes an event, and acks the message', async () => {
  const { listener, data, msg, ticket } = await setup()
  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket!.orderId).not.toBeDefined()
  expect(msg.ack).toHaveBeenCalled()
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})