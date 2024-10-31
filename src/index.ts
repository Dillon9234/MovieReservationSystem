import express, { Application } from 'express'
import mongoose from 'mongoose'
import session from 'express-session'
import MongoDBStore from 'connect-mongodb-session'
import dotenv from 'dotenv'
import userRouter from './api/User'
import movieRouter from './api/Movie'
import theaterRouter from './api/Theater'
import bookRouter from './api/Book'
import cookieParser from 'cookie-parser'

dotenv.config()

const app: Application = express()
const port = process.env.PORT || 3000

mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("DB Connected")
  })
  .catch((err: unknown) => console.error('MongoDB connection error:', err))

const MongoDBSession = MongoDBStore(session)
const store = new MongoDBSession({
  uri: process.env.MONGODB_URI as string,
  collection: 'MySessions',
})

app.use(express.json())
app.use(session({
  secret: 'Some Secret',
  resave: false,
  saveUninitialized: false,
  store: store,
}))
app.use(cookieParser(process.env.COOKIE_SIGN))

app.use('/user', userRouter)
app.use('/movie',movieRouter)
app.use('/theater',theaterRouter)
app.use('/book',bookRouter)

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})
