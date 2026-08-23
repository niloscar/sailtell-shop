/**
 * Routes for handling customer-related API endpoints.
 */

import { Router } from 'express'
import { getCustomersHandler, getCustomerHandler, createCustomerHandler, updateCustomerHandler, deleteCustomerHandler } from '../controllers/customerController'

const customersRouter = Router()

customersRouter.get('/', getCustomersHandler)
customersRouter.get('/:id', getCustomerHandler)
customersRouter.post('/', createCustomerHandler)
customersRouter.patch('/:id', updateCustomerHandler)
customersRouter.delete('/:id', deleteCustomerHandler)

export default customersRouter