const customErrors = require('../Error')

const authenticationMiddleware = async (req, res, next) => {
  if (req.isAuthenticated()) return next()
  throw new customErrors.UnauthenticatedError('Not authenticated')
  next()
}

module.exports = {
  authenticationMiddleware,
}
