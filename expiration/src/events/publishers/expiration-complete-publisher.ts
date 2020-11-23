import { Subjects, Publisher, ExpirationCompleteEvent } from '@okradzemirian/ticketing-common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
}