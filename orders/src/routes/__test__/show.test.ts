import request from 'supertest'
import { app } from '../../app'
import { mongoId, signin } from '../../test/utils'
import { Ticket } from '../../models/ticket'

it('fetches the order', async () => {
  // create ticket
  const ticket = Ticket.build({
    id: mongoId(),
    title: 'Concert',
    price: 20,
  })
  await ticket.save()
  
  const user = signin()

  // create order with this ticket

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  // fetch order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200)

  expect(fetchedOrder.id).toEqual(order.id)
})

it('returns an error if user tries to fetch other users order', async () => {
  // create ticket
  const ticket = Ticket.build({
    id: mongoId(),
    title: 'Concert',
    price: 20,
  })
  await ticket.save()
  
  const user = signin()

  // create order with this ticket

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  // fetch order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', signin())
    .send()
    .expect(401)
})
