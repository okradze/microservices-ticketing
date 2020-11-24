import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { OrderStatus } from '@okradzemirian/ticketing-common'

export { OrderStatus }

interface OrderFields {
  id: string,
  userId: string,
  status: OrderStatus,
  price: number,
  version: number,
}

interface OrderDoc extends mongoose.Document {
  userId: string,
  status: OrderStatus,
  price: number,
  version: number,
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(fields: OrderFields): OrderDoc
}

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
  },
  price: {
    type: Number,
    required: true,
  },
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    }
  }
})

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (fields: OrderFields) => {
  return new Order({
    _id: fields.id,
    ...fields,
  })
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order }