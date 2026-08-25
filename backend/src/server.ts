/**
 * This file initializes the Express server, sets up middleware, and defines API routes.
 */

/* Import dependencies */
import express from 'express'
import expressSession from 'express-session'
import dotenv from 'dotenv'
import path from 'path'
import { connect } from './database'

/* Import route handlers */
import customerRoutes from './routes/customerRoutes'
import productRoutes from './routes/productRoutes'
import orderRoutes from './routes/orderRoutes'
import usersRouter from './routes/userRoutes'
import authRouter from './routes/authRoutes'
import categoryRoutes from './routes/categoryRoutes'
import cartRoutes from './routes/cartRoutes'

/* Load environment variables from .env file */
dotenv.config()

/* Initialize Express app */
const app = express()
const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3000

/* Middleware */
app.use(express.static('public')) // Serve static files from the "public" folder (so that e.g., avatars from users/ are accessible via /api/users/)
app.use(express.json()) // Allow parsing of JSON in the request body
app.use(express.urlencoded({ extended: true })) // Allow parsing of URL-encoded data (e.g., from forms)
app.use(expressSession({
  secret: process.env.SECRET_KEY || 'secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    maxAge: 60 * 60 * 1000 // 1h
  }
})) // Enable session support

/* API routes */
app.use('/api/customers', customerRoutes)
app.use('/api/users', usersRouter)
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/auth', authRouter)
app.use('/api/carts', cartRoutes)

/* Handle unknown API endpoints */
app.use('/api', (req, res) => {
  res.status(404).json({
    error: 'Ogiltig metod och/eller endpoint',
    message: `${req.method} och ${req.originalUrl} är ingen giltig kombination.`,
  })
})

/* Serve frontend from the "public" folder */
const publicPath = path.resolve(process.cwd(), 'public')
app.use(express.static(publicPath))


const start = async () => {
  await connect() // Ensure database connection is established before starting the server

  /* Start the server */
  app.listen(port, () => {
    console.log(`Server is running on http://${host}:${port}`)
  })
}

start()