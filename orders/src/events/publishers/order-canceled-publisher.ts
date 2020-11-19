import { Publisher, OrderCanceledEvent, Subjects } from '@okradzemirian/ticketing-common'

export class OrderCanceledPublisher extends Publisher<OrderCanceledEvent> {
  readonly subject = Subjects.OrderCanceled
}