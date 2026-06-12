/**
 * Server setup for the e-shop application.
 * This file initializes the Express server, sets up middleware, and defines API routes.
 */

/* Import dependencies */
import express from 'express'
import expressSession from 'express-session'
import dotenv from 'dotenv'
import path from 'path'

/* Import route handlers */
import customerRoutes from './routes/customers'
import productRoutes from './routes/products'
// import orderRoutes from './routes/orders'

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
app.use('/api/products', productRoutes)
// app.use('/api/orders', orderRoutes)

/* Serve frontend from the "public" folder */
const publicPath = path.resolve(process.cwd(), 'public')
app.use(express.static(publicPath))

/* Start the server */
app.listen(port, () => {
  console.log(`Server is running on http://${host}:${port}`)
})