/**
 * Routes for handling customer-related API endpoints.
 */

import { Router } from 'express'
import { getCustomersHandler, getCustomerHandler, createCustomerHandler, updateCustomerHandler } from '../controllers/customerController'
import { requireAdmin } from '../middleware/authMiddleware'

const customerRouter = Router()

customerRouter.use(requireAdmin)

customerRouter.get('/', getCustomersHandler)
customerRouter.get('/:id', getCustomerHandler)
customerRouter.post('/', createCustomerHandler)
customerRouter.patch('/:id', updateCustomerHandler)

export default customerRouter