import request from 'supertest'
import { app } from '../../app'

it('responds with details about the current user', async () => {
  const agent = request.agent(app)

  await agent
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)

  const response = await agent
    .get('/api/users/currentuser')
    .send()
    .expect(400)
  
  expect(response.body.currentUser.email).toEqual('test@test.com')
})

it('responds with null if not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200)

  expect(response.body.currentUser).toEqual(null)
})