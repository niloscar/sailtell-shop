/**
 * This file defines the routes for handling customer-related API endpoints.
 */

import { Router } from 'express'

const customersRouter = Router()

/* Mock data for customers. */
const customers = [
  { id: 1, fname: 'Anders', lname: 'Andersson', email: 'anders@example.com' },
  { id: 2, fname: 'Erik', lname: 'Eriksson', email: 'erik@example.com' },
  { id: 3, fname: 'John', lname: 'Johnsson', email: 'john@example.com' }
]

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
    res.status(404).json({ error: 'Customer not found' })
  }
})

export default customersRouter