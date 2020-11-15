import request from 'supertest'
import { app } from '../../app'
import { signin, mongoId } from '../../test/utils'
import { natsWrapper } from '../../nats-wrapper'

it('returns 404 if id does not exist', async () => {
  await request(app)
    .put(`/api/tickets/${mongoId()}`)
    .set('Cookie', signin())
    .send({ title: 'test', price: 10 })
    .expect(404)
})

it('returns 401 if the user is not authenticated', async () => {
  await request(app)
    .put(`/api/tickets/${mongoId()}`)
    .send({ title: 'test', price: 10 })
    .expect(401)
})

it('returns 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
      title: 'test',
      price: 20,
    })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', signin())
    .send({ title: 'test', price: 25 })
    .expect(401)
})

it('returns 400 if the user provides an invalid title or price', async () => {
  const cookie = signin()
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 20,
    })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 20 })
    .expect(400)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ price: -20 })
    .expect(400)
})

it('updates the ticket with valid inputs', async () => {
  const cookie = signin()
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 20,
    })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'test1', price: 30 })
    .expect(200)

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()

  expect(ticketResponse.body.title).toEqual('test1')
  expect(ticketResponse.body.price).toEqual(30)
})

it('publishes event', async () => {
  const cookie = signin()
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 20,
    })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'test1', price: 30 })
    .expect(200)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})