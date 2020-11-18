import request from 'supertest'
import { app } from '../../app'
import { signin } from '../../test/utils'
import { Order } from '../../models/order'
import { Ticket } from '../../models/ticket'

const buildTicket = () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  })
  return ticket.save()
}

it('fetches orders for a particular user', async () => {
  // create three tickets
  const ticketOne = await buildTicket()
  const ticketTwo = await buildTicket()
  const ticketThree = await buildTicket()

  const userOne = signin()
  const userTwo = signin()

  // create one order as User #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201)


  // create two orders as User #2

  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201)

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201)

  // get orders for User #2

  const { body: orders } = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .send()
    .expect(200)

  expect(orders.length).toEqual(2)
  expect(orders[0].id).toEqual(orderOne.id)
  expect(orders[1].id).toEqual(orderTwo.id)
  expect(orders[0].ticket.id).toEqual(ticketTwo.id)
  expect(orders[1].ticket.id).toEqual(ticketThree.id)
})