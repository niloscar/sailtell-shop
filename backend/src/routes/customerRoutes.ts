/**
 * Routes for handling customer-related API endpoints.
 */

import { Router } from 'express'
import { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer } from '../controllers/customerController'

const customersRouter = Router()

customersRouter.get('/', getCustomers)
customersRouter.get('/:id', getCustomer)
customersRouter.post('/', createCustomer)
customersRouter.patch('/:id', updateCustomer)
customersRouter.delete('/:id', deleteCustomer)

export default customersRouter