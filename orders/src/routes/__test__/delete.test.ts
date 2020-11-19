import request from 'supertest'
import { app } from '../../app'
import { signin } from '../../test/utils'
import { Ticket } from '../../models/ticket'
import { Order, OrderStatus } from '../../models/order'
import { natsWrapper } from '../../nats-wrapper'

it('marks an order as canceled', async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price:20,
  })
  await ticket.save()
  
  const user = signin()

  // create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  // cancel an order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)

  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder!.status).toEqual(OrderStatus.Canceled)
})

it('emits an order canceled event', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price:20,
  })
  await ticket.save()
  
  const user = signin()

  // create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  // cancel an order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})