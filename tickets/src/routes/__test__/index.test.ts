import request from 'supertest'
import { app } from '../../app'
import { signin } from '../../test/utils'

const createTicket = () => {
  return request(app)
  .post('/api/tickets')
  .set('Cookie', signin())
  .send({
    title: 'asf',
    price: 20,
  })
  .expect(201)
}

it('can fetch list of tickets', async () => {
  await createTicket()
  await createTicket()
  await createTicket()

  const response = await request(app)
    .get('/api/tickets')
    .send()
    .expect(200)

  expect(response.body.length).toEqual(3)
})