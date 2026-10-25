/**
 * Routes for handling customer-related API endpoints.
 */

import { Router } from 'express'
import { requireAdmin } from '../middleware/auth.middleware'
import {
  getCustomersHandler,
  getCustomerHandler,
  createCustomerHandler,
  updateCustomerHandler
} from '../controllers/customer.controller'

const customerRouter = Router()

customerRouter.use(requireAdmin)

customerRouter.get('/', getCustomersHandler)
customerRouter.get('/:id', getCustomerHandler)
customerRouter.post('/', createCustomerHandler)
customerRouter.patch('/:id', updateCustomerHandler)

export default customerRouter
