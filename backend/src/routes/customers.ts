/**
 * This file defines the routes for handling customer-related API endpoints.
 */

import { Router } from 'express'
import { mockCustomers } from '../data/mockdata'

const customersRouter = Router()

/* Mock data for customers. */
const customers = mockCustomers

/* GET /api/customers - Get all customers */
customersRouter.get('/', (req, res) => {
  res.json(customers)
})

/* GET /api/customers/:id - Get a customer by ID */
customersRouter.get('/:id', (req, res) => {
  const customerId = parseInt(req.params.id)
  const customer = customers.find(customer => customer.id === customerId)

  if (customer) {
    res.json(customer)
  } else {
    res.status(404).json({ error: 'Kunden kunde inte hittas.' })
  }
})

export default customersRouter