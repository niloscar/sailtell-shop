/**
 * Routes for handling payment-related API endpoints.
 */

import { Router } from 'express'
import { createPaymentHandler } from '../controllers/payment.controller'

const paymentRouter = Router()

paymentRouter.post('/checkout', createPaymentHandler)

export default paymentRouter
