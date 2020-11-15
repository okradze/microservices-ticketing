import { Publisher, Subjects, TicketUpdatedEvent } from '@okradzemirian/ticketing-common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}