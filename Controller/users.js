const User = require('../Module/user')
const { StatusCodes } = require('http-status-codes')

const fetchUsers = async (req, res, next) => {
  const { username, email, status } = req.query
  let filter = {}
  if (username) {
    filter.username = username
  }
  if (email) filter.email = email
  if (status) filter.isActive = status === 'Active' ? 1 : 0
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit
  let result = User.find(filter)
  result = result.skip(skip).limit(limit).sort('-createdAt')
  const count = await User.countDocuments(filter)
  const pageCount = Math.ceil(count / limit)
  const users = await result
  res
    .status(StatusCodes.OK)
    .json({ msg: 'OK', users, meta: { page, pageCount, count } })
}

module.exports = {
  fetchUsers,
}
