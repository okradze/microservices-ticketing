import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

export const mongoId = () => new mongoose.Types.ObjectId().toHexString()

export const signin = (id?: string) => {
  const payload = {
    id: id || mongoId(),
    email: 'test@test.com',
  }

  const token = jwt.sign(payload, process.env.JWT_KEY!)
  const session = JSON.stringify({ jwt: token })
  const base64 = Buffer.from(session).toString('base64')

  return [`express:sess=${base64}`]
}