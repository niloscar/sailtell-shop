import { Router } from 'express'
import { createPaymentHandler, getPaymentConfirmationHandler } from '../controllers/payment.controller'

const paymentRouter = Router()

paymentRouter.post('/checkout', createPaymentHandler)
paymentRouter.get('/confirmation', getPaymentConfirmationHandler)

export default paymentRouter
