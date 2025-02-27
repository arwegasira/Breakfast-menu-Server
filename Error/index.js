const CustomError = require('./customError')
const BadRequestError = require('./badRequestError')
const NotFoundError = require('./notFoundError')
const UnauthorizedError = require('./unauthorizedError')
const UnauthenticatedError = require('./unauthenticatedError')

module.exports = {
  CustomError,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  UnauthenticatedError,
}
