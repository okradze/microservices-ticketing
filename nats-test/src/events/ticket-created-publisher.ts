import { Subjects, Publisher, TicketCreatedEvent } from '@okradzemirian/ticketing-common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}