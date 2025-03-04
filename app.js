const express = require('express')
const app = express()
const passport = require('passport')
//env configuration
require('dotenv').config()
//async errors
require('express-async-errors')

const session = require('express-session')
const MongoStore = require('connect-mongo')

const cors = require('cors')
app.use(
  cors({
    origin: 'http://localhost:5173',
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

const { passportLoginLocal, passportGoogleLogin } = require('./Controller/auth')
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
      maxAge: 2 * 60 * 1000,
    },
  })
)
app.use(passport.initialize())
app.use(passport.session())

//routes
app.use('/api/v1/rooms', roomsRoutes)
app.use('/api/v1/breakfastItems', breakFastItemsRoutes)
app.use('/api/v1/order', orderRoutes)
app.use('/api/v1/auth', authRoutesRoutes)

//local strategy login
app.use(
  '/api/v1/auth/login',
  passport.authenticate('local'),
  passportLoginLocal
)
//google strategy
app.get(
  '/api/v1/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

app.get('/auth/google/callback', passportGoogleLogin)

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
