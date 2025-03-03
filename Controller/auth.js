const User = require('../Module/user')
const customErrors = require('../Error')
const { StatusCodes } = require('http-status-codes')
const crypto = require('crypto')
const passport = require('passport')
const { sendVerificationEmail } = require('../Util')

const registerUser = async (req, res) => {
  let { email, name, role } = req.body
  if (!email || !name)
    throw new customErrors.BadRequestError('Provided email and name')
  const user = await User.findOne({ email: email })
  if (user) throw new customErrors.BadRequestError('user already exists')
  const isFirstUser = (await User.countDocuments({})) === 0
  role = isFirstUser ? 'admin' : role
  const verificationToken = crypto.randomBytes(40).toString('hex')
  const newUser = new User({
    email,
    role,
    verificationToken,
    name,
  })
  await newUser.save()
  //send notification email
  const origin =
    process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_PRODUCTION
      : process.env.FRONTEND_DEV

  await sendVerificationEmail({
    userEmail: newUser.email,
    subject: 'Please verify your account',
    origin: `${origin}/verifyAccount`,
    verificationToken: newUser.verificationToken,
    userName: newUser.name,
  })

  res
    .status(StatusCodes.CREATED)
    .json({ message: 'Account created successfully' })
}

const verifyAccount = async (req, res) => {
  const { email, verificationToken, password } = req.body
  if (!email || !verificationToken || !password)
    throw new customErrors.BadRequestError('provide required information')
  const user = await User.findOne({ email: email })
  if (!user) throw new customErrors.UnauthenticatedError('Verification failed')
  if (verificationToken !== user.verificationToken)
    throw new customErrors.UnauthenticatedError('Verification failed')
  // make sure user choose a strong password
  const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
  const isPasswordStrong = pattern.test(password)
  if (!isPasswordStrong)
    throw new customErrors.BadRequestError(
      'password should be at least 8 char long, at least one uppercase, at least one special character'
    )
  user.password = password
  user.verificationToken = ''
  user.verified = Date.now()
  user.isVerified = true
  await user.save()
  res.status(StatusCodes.OK).json({ message: 'account verified successfully' })
}
//this method is crashing the server if user is not authenticated
// const passportLoginLocal = (req, res, next) => {
//   passport.authenticate('local', (err, user, info) => {
//     if (err) next(err)
//     if (!user) {
//       return res
//         .status(401)
//         .json({ message: info?.message || 'Invalid Credentials' })
//     } else {
//       req.logIn(user, (err) => {
//         if (err) next(err)
//         return res.status(200).json({ message: 'login success', user })
//       })
//     }
//   })(req, res, next)
// }

const passportLoginLocal = async (req, res) => {
  res
    .status(StatusCodes.OK)
    .json({
      message: 'login successful',
      user: { name: req.user.name, email: req.user.email, role: req.user.role },
    })
}

module.exports = {
  registerUser,
  verifyAccount,
  passportLoginLocal,
}
