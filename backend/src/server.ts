/**
 * This file initializes the Express server, sets up middleware, and defines API routes.
 */

/* External dependencies */
import express from 'express'
import type { NextFunction, Request, Response } from 'express'
import expressSession from 'express-session'
import connectPgSimple from 'connect-pg-simple'
import dotenv from 'dotenv'

/* Internal modules */
import { connect, pool } from './database'
import { webhookHandler } from './controllers/payment.controller'

/* Routes */
import authRouter from './routes/auth.routes'
import cartRouter from './routes/cart.routes'
import categoryRouter from './routes/category.routes'
import customerRouter from './routes/customer.routes'
import orderRouter from './routes/order.routes'
import paymentRouter from './routes/payment.routes'
import productRouter from './routes/product.routes'
import searchRouter from './routes/search.routes'
import supplierRouter from './routes/supplier.routes'
import usersRouter from './routes/user.routes'

/* Load environment variables from .env file */
dotenv.config()

/* Initialize Express app */
const app = express()
const port = process.env.PORT || 3000

const PgSession = connectPgSimple(expressSession)

/* Stripe webhook – must be registered before express.json() */
app.post(
  '/api/payment/webhook',
  express.raw({ type: 'application/json' }),
  webhookHandler
)

/* Middleware */
app.use(express.static('public')) // Serve static files from the "public" folder
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
app.use('/api/carts', cartRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/customers', customerRouter)
app.use('/api/orders', orderRouter)
app.use('/api/payment', paymentRouter)
app.use('/api/products', productRouter)
app.use('/api/search', searchRouter)
app.use('/api/supplier', supplierRouter)
app.use('/api/users', usersRouter)

/* Handle unknown API endpoints */
app.use('/api', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Ogiltig metod och/eller endpoint',
    message: `${req.method} och ${req.originalUrl} är ingen giltig kombination.`
  })
})

/* Handle API errors */
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error)

  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Ett internt serverfel inträffade.'
  })
})

const start = async () => {
  await connect() // Ensure database connection is established before starting the server

  /* Start the server */
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}

start()
