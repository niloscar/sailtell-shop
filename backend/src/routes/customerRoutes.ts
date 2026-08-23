/**
 * Routes for handling customer-related API endpoints.
 */

import { Router } from 'express'
import { getCustomersHandler, getCustomerHandler, createCustomerHandler, updateCustomerHandler } from '../controllers/customerController'

const customerRouter = Router()

customerRouter.get('/', getCustomersHandler)
customerRouter.get('/:id', getCustomerHandler)
customerRouter.post('/', createCustomerHandler)
customerRouter.patch('/:id', updateCustomerHandler)

export default customerRouter