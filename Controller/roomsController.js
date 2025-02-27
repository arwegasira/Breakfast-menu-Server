const Room = require('../Module/rooms')
const customErrors = require('../Error')
const { StatusCodes } = require('http-status-codes')

const addRoom = async (req, res) => {
  const { name, phoneNumber } = req.body
  if (!name || !phoneNumber) {
    throw new customErrors.BadRequestError(
      'Please provide name and phone number'
    )
  }

  const room = new Room({ name, phoneNumber })
  await room.save()
  res.status(StatusCodes.OK).json({ message: 'Ok', room })
}
const editRoom = async (req, res) => {
  const { id: roomId } = req.params

  const room = await Room.findByIdAndUpdate({ _id: roomId }, req.body, {
    returnDocument: 'after',
  })

  res.status(StatusCodes.OK).json({ message: 'Ok', room })
}
const getRoom = async (req, res) => {
  const { search } = req.query
  const filter = {}
  if (search) {
    const regex = new RegExp('^' + search)
    filter.$or = [
      {
        name: { $regex: regex, $options: 'i' },
      },
      {
        phoneNumber: { $regex: regex, $options: 'i' },
      },
    ]
  }

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit
  let result = Room.find(filter)
  result = result.skip(skip).limit(limit).sort('-createdAt')
  const count = await Room.countDocuments(filter)
  const pageCount = Math.ceil(count / limit)
  const rooms = await result

  res.status(StatusCodes.OK).json({ rooms, meta: { count, pageCount, page } })
}
const deleteRoom = async (req, res, next) => {
  const { id } = req.params
  if (!id) throw new customErrors.BadRequestError('Missing room id')
  const rooms = await Room.findByIdAndDelete(id)
  res.status(StatusCodes.OK).json({ message: 'success' })
}
module.exports = {
  addRoom,
  editRoom,
  getRoom,
  deleteRoom,
}
