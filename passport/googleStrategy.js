const passport = require('passport')
const { Strategy } = require('passport-google-oauth20')
const User = require('../Module/user')
const customErrors = require('../Error')

passport.serializeUser((user, done) => {
  done(null, user._id)
})
passport.deserializeUser((id, done) => {
  try {
    const user = User.findOne({ _id: id }).select({ password: 0 })
    if (!user) throw new customErrors.UnauthenticatedError('User not found')
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})
module.exports = passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          email: profile.emails[0].value,
        }).select({ password: 0 })
        if (!user)
          throw new customErrors.UnauthenticatedError('Invalid credentials')
        if (!user.isActive)
          throw new customErrors.UnauthenticatedError('Account disabled')
        //update the user if fist time login
        if (!user.isVerified) {
          user = await User.findOneAndUpdate(
            { email: profile.emails[0].value },
            {
              name: profile.displayName,
              googleId: profile.id,
              isVerified: true,
            },
            {
              new: true,
            }
          )
        }
        done(null, user)
      } catch (error) {
        done(error, null)
      }
    }
  )
)
