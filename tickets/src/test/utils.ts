import jwt from 'jsonwebtoken'

export const signin = () => {
  const payload = {
    id: '1kjasflk',
    email: 'test@test.com',
  }

  const token = jwt.sign(payload, process.env.JWT_KEY!)
  const session = JSON.stringify({ jwt: token })
  const base64 = Buffer.from(session).toString('base64')

  return [`express:sess=${base64}`]
}