const mongoose = require('mongoose')

const Schema = mongoose.Schema

const rooms = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
)
module.exports = mongoose.model('room', rooms)
