import { Message } from 'node-nats-streaming'
import { Listener, Subjects, TicketCreatedEvent } from '@okradzemirian/ticketing-common'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
  queueGroupName = 'payments-service'
  
  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log(data)
    msg.ack()
  }
}