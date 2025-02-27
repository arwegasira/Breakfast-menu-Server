const mongoose = require('mongoose')
const Schema = mongoose.Schema

const counterSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    counterValue: {
      type: Number,
      required: true,
    },
  },
  { timeseries: true }
)

module.exports = mongoose.model('counter', counterSchema)
