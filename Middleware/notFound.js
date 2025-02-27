const { StatusCodes } = require('http-status-codes')
const notFound = (req, res, next) => {
  res.status(StatusCodes.NOT_FOUND).json({ message: 'Resource not found' })
}

module.exports = notFound
