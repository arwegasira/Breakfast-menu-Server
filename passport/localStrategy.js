const passport = require('passport')
const { Strategy } = require('passport-local')
const User = require('../Module/user')
const customErrors = require('../Error')
passport.serializeUser((user, done) => {
  done(null, user._id)
})
passport.deserializeUser((id, done) => {
  try {
    const user = User.findOne({ _id: id })
    if (!user) throw new customErrors.UnauthenticatedError('User not found')
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})
module.exports = passport.use(
  new Strategy({ usernameField: 'email' }, async (username, password, done) => {
    try {
      const user = await User.findOne({ email: username })
      if (!user)
        throw new customErrors.UnauthenticatedError('Invalid credentials')
      if (!user.isVerified)
        throw new customErrors.UnauthenticatedError(
          'Please verify your account'
        )
      if (!user.isActive)
        throw new customErrors.UnauthenticatedError('Account disabled')
      const isPasswordCorrect = await user.comparePassword(
        password,
        user.password
      )
      if (!isPasswordCorrect)
        throw new customErrors.UnauthenticatedError('Invalid credentials')
      done(null, user)
    } catch (error) {
      done(error, null)
    }
  })
)
