import { Publisher, OrderCanceledEvent, Subjects } from '@okradzemirian/ticketing-common'

export class OrderCreatedPublisher extends Publisher<OrderCanceledEvent> {
  readonly subject = Subjects.OrderCanceled
}