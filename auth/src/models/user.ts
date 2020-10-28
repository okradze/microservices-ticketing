import mongoose from 'mongoose'
import { Password } from '../services/password'

interface UserFields {
  email: string,
  password: string,
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(fields: UserFields): UserDoc;
}

interface UserDoc extends mongoose.Document {
  email: string,
  password: string,
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

userSchema.pre('save', async function (done) {
  if(this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'))
    this.set('password', hashed)
  }
  done()
})

userSchema.statics.build = (fields: UserFields) => {
  return new User(fields)
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User }