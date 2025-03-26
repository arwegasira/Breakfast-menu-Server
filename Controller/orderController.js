const { CustomError } = require('../Error')
const Order = require('../Module/order')
const Room = require('../Module/rooms')
const Counter = require('../Module/counter')
const { StatusCodes } = require('http-status-codes')
const mongoose = require('mongoose')

const createOrder = async (req, res, next) => {
  const { room, items } = req.body
  if (!room || !items)
    throw new CustomError.BadRequestError('Please provide room and order items')
  const roomDetails = await Room.find(
    { name: room },
    { createdAt: 0, updatedAt: 0, __v: 0 }
  )
  if (!roomDetails)
    throw new CustomError.NotFoundError(
      'Room not found, verify your room selection'
    )
  const session = await mongoose.startSession()
  session.startTransaction()
  //find and update counter
  let counter = await Counter.findOneAndUpdate(
    { name: 'orderSequence' },
    { $inc: { counterValue: 1 } },
    { upsert: true, new: true, session: session }
  )
  counter = counter.counterValue.toString().padStart(4, '0')
  const order = new Order({
    orderItems: items,
    roomDetails: roomDetails,
    orderNumber: `ORD-${counter}`,
  })

  const result = await order.save({ session })

  if (!result) {
    session.abortTransaction()
    throw new Error('Error saving order, please try again.')
  }
  await session.commitTransaction()
  session.endSession()

  res.status(StatusCodes.OK).json({ message: 'success' })
}
const getAllOrder = async (req, res) => {
  const { search } = req.query
  const filter = {}
  if (search) {
    const regex = new RegExp('^' + search)
    filter.$or = [
      {
        orderNumber: { $regex: regex, $options: 'i' },
      },
      {
        status: { $regex: regex, $options: 'i' },
      },
    ]
  }
  const orders = await Order.find(search).sort('status')
  res.status(StatusCodes.OK).json({ message: 'success' })
}
const getAllOrdersV2 = async (req, res, next) => {
  const { status, room, orderNumber } = req.query
  let filter = {}
  if (status) filter.status = status
  if (orderNumber) filter.orderNumber = orderNumber
  if (room) {
    filter = { ...filter, 'roomDetails.name': room }
  }
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit
  let result = Order.find(filter)
  result = result.skip(skip).limit(limit).sort('-createdAt')
  const count = await Order.countDocuments(filter)
  const pageCount = Math.ceil(count / limit)
  const orders = await result

  res.status(StatusCodes.OK).json({ orders, currentPage: page, pageCount })
}

const getOrderById = async (req, res, next) => {
  const { id } = req.params
  const order = await Order.findOne({ _id: id })
  res.status(StatusCodes.OK).json({ order: order })
}
module.exports = {
  createOrder,
  getAllOrder,
  getAllOrdersV2,
  getOrderById,
}
