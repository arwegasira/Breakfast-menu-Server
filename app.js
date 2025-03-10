const express = require('express')
const app = express()
const passport = require('passport')
//env configuration
require('dotenv').config()
//async errors
require('express-async-errors')

const session = require('express-session')
const MongoStore = require('connect-mongo')
const origin =
  process.env.NODE_ENV === 'dev'
    ? process.env.DEV_FRONTEND_URL
    : process.env.PRO_FRONTEND_URL

const cors = require('cors')
const allowedOrigin = [origin, 'http://localhost:3000/api/v1']
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigin.includes(origin)) {
//         callback(null, true)
//       } else {
//         callback(new Error('Not allowed by cors'))
//       }
//     },
//     credentials: true,
//   })
// )
app.use(
  cors({
    origin,
    credentials: true,
  })
)

const connect = require('./db/connect')
require('./passport/localStrategy')
require('./passport/googleStrategy')
//important middleware
const errorHandlerMiddleware = require('./Middleware/errorHandler')
const notFoundMiddleware = require('./Middleware/notFound')
const { authenticationMiddleware } = require('./Middleware/authentication')

//Require Routes
const roomsRoutes = require('./Routes/roomRoute')
const breakFastItemsRoutes = require('./Routes/breakfastItems')
const orderRoutes = require('./Routes/orderRoutes')
const authRoutesRoutes = require('./Routes/authRoutes')
const orderItemsSelection = require('./Routes/itemSelectionRoute')
const homeRoomSelection = require('./Routes/homeRoomSelection')

const {
  passportLoginLocal,
  passportGoogleLogin,
  passportLogout,
} = require('./Controller/auth')
//Port
const port = process.env.PORT || 3000
app.use(express.json())
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'session',
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    },
  })
)
app.use(passport.initialize())
app.use(passport.session())

//routes
app.use('/api/v1/rooms', authenticationMiddleware, roomsRoutes)
app.use('/api/v1/home', homeRoomSelection)
app.use(
  '/api/v1/breakfastItems',
  authenticationMiddleware,
  breakFastItemsRoutes
)
app.use('/api/v1/your-order', orderItemsSelection)
app.use('/api/v1/order', authenticationMiddleware, orderRoutes)
app.use('/api/v1/auth', authRoutesRoutes)

//local strategy login
app.use(
  '/api/v1/auth/login',
  passport.authenticate('local'),
  passportLoginLocal
)
//google strategy login
app.get(
  '/api/v1/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

app.get('/auth/google/callback', passportGoogleLogin)

// passport logout
app.post('/api/v1/auth/logout', passportLogout)

app.get(
  '/api/v1/protected-route',
  authenticationMiddleware,
  (req, res, next) => {
    res.status(200).json({ message: 'protected route works' })
  }
)
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const start = async () => {
  try {
    await connect(process.env.MONGO_URI)
    app.listen(port, () => console.log(`Server listening on port ${port}`))
  } catch (error) {}
}

start()
