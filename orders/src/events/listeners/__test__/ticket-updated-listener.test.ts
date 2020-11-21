import { Message } from 'node-nats-streaming'
import { TicketUpdatedEvent } from '@okradzemirian/ticketing-common'
import { TicketUpdatedListener } from '../ticket-updated-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'
import { mongoId } from '../../../test/utils'

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client)

  const ticket = Ticket.build({
    id: mongoId(),
    title: 'concert',
    price: 20,
  })
  await ticket.save()

  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: mongoId(),
    version: ticket.version + 1,
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg, ticket }
}

it('finds updates and saves a ticket', async () => {
  const { listener, data, msg, ticket } = await setup()

  await listener.onMessage(data, msg)
  
  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket!.title).toEqual(data.title)
  expect(updatedTicket!.price).toEqual(data.price)
  expect(updatedTicket!.version).toEqual(data.version)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})

it('does not call ack if the event has skipped version number', async () => {
  const { listener, data, msg, ticket } = await setup()
  data.version = 10

  try {
    await listener.onMessage(data, msg)
  } catch (error) {
    
  }

  expect(msg.ack).not.toHaveBeenCalled()
})