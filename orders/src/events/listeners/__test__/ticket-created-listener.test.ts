import { Message } from 'node-nats-streaming'
import { TicketCreatedEvent } from '@okradzemirian/ticketing-common'
import { TicketCreatedListener } from '../ticket-created-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { mongoId } from '../../../test/utils'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client)
  
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: mongoId(),
    userId: mongoId(),
    title: 'concert',
    price: 20,
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg }
}

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  const ticket = await Ticket.findById(data.id)

  expect(ticket).toBeDefined()
  expect(ticket!.title).toEqual(data.title)
  expect(ticket!.price).toEqual(data.price)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})