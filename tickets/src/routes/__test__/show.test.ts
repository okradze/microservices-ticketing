import request from 'supertest'
import { app } from '../../app'
import { signin, mongoId } from '../../test/utils'

it('returns 404 if ticket is not found', async () => {
  await request(app)
    .get(`/api/tickets/${mongoId()}`)
    .send()
    .expect(404)
})

it('returns ticket if ticket is found', async () => {
  const title = 'title'
  const price = 20

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
      title,
      price
    })
    .expect(201)

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200)

  expect(ticketResponse.body.title).toEqual(title)
  expect(ticketResponse.body.price).toEqual(price)
})