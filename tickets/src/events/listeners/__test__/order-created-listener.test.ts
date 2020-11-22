import { Message } from 'node-nats-streaming'
import { OrderCreatedEvent, OrderStatus } from '@okradzemirian/ticketing-common'
import { OrderCreatedListener } from '../order-created-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'
import { mongoId } from '../../../test/utils'

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)

  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: mongoId(),
  })
  await ticket.save()

  const data: OrderCreatedEvent['data'] = {
    id: mongoId(),
    status: OrderStatus.Created,
    userId: mongoId(),
    expiresAt: 'afalksjf',
    ticket: {
        id: ticket.id,
        price: ticket.price,
    },
    version: 0,
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg, ticket }
}

it('sets the userId of the ticket', async () => {
  const { listener, data, msg, ticket } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.orderId).toEqual(data.id)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  
  expect(msg.ack).toHaveBeenCalled()
})

it('publishes a ticket updated event', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()

  const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
  expect(data.id).toEqual(ticketUpdatedData.orderId)
})