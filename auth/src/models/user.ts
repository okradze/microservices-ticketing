import mongoose from 'mongoose'

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

userSchema.statics.build = (fields: UserFields) => {
  return new User(fields)
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User }