/**
 * This file initializes the Express server, sets up middleware, and defines API routes.
 */

/* Import dependencies */
import express from 'express'
import expressSession from 'express-session'
import connectPgSimple from 'connect-pg-simple'
import dotenv from 'dotenv'
import path from 'path'
import { connect, pool } from './database'

/* Import route handlers */
import authRouter from './routes/auth.routes'
import cartRoutes from './routes/cart.routes'
import categoryRoutes from './routes/category.routes'
import customerRoutes from './routes/customer.routes'
import orderRoutes from './routes/order.routes'
// import priceRoutes from './routes/price.routes'
import productRoutes from './routes/product.routes'
import usersRouter from './routes/user.routes'

/* Load environment variables from .env file */
dotenv.config()

/* Initialize Express app */
const app = express()
const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3000

const PgSession = connectPgSimple(expressSession)

/* Middleware */
app.use(express.static('public')) // Serve static files from the "public" folder (so that e.g., avatars from users/ are accessible via /api/users/)
app.use(express.json()) // Allow parsing of JSON in the request body
app.use(express.urlencoded({ extended: true })) // Allow parsing of URL-encoded data (e.g., from forms)
app.use(
  expressSession({
    store: new PgSession({
      pool
    }),
    secret: process.env.SECRET_KEY || 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 60 * 60 * 1000
    }
  })
) // Enable session support

/* API routes */
app.use('/api/auth', authRouter)
app.use('/api/carts', cartRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/orders', orderRoutes)
// app.use('/api/price', priceRoutes)
app.use('/api/products', productRoutes)
app.use('/api/users', usersRouter)

/* Handle unknown API endpoints */
app.use('/api', (req, res) => {
  res.status(404).json({
    error: 'Ogiltig metod och/eller endpoint',
    message: `${req.method} och ${req.originalUrl} är ingen giltig kombination.`
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
