import { Publisher, PaymentCreatedEvent, Subjects } from '@okradzemirian/ticketing-common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
}