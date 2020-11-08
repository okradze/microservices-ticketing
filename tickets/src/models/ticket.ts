import mongoose from 'mongoose'

interface TicketFields {
  title: string,
  price: number,
  userId: string,
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(fields: TicketFields): TicketDoc
}

interface TicketDoc extends mongoose.Document {
  title: string,
  price: number,
  userId: string
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    }
  }
})

ticketSchema.statics.build = (fields: TicketFields) => {
  return new Ticket(fields)
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }