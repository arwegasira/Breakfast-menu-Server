const mongoose = require('mongoose')

const Schema = mongoose.Schema

const order = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    roomDetails: {
      type: Object,
      required: true,
    },
    orderItems: {
      type: Array,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'Pending',
    },
  },
  { timestamps: true }
)
module.exports = mongoose.model('order', order)
