/**
 * Controller functions for handling customer-related API endpoints.
 */

import { Request, Response } from 'express'
import { getCustomers, getCustomer, createCustomer, updateCustomer } from '../services/customerService'

type CustomerParams = {
  id: string
}

export async function getCustomersHandler(req: Request, res: Response) {
  const customers = await getCustomers()
  res.json(customers)
}

export async function getCustomerHandler(req: Request<CustomerParams>, res: Response) {
  const customerId = parseInt(req.params.id)
  const customer = await getCustomer(customerId)

  if (customer) {
    res.json(customer)
  } else {
    res.status(404).json({ error: 'Kunden kunde inte hittas.' })
  }
}

export async function createCustomerHandler(req: Request, res: Response) {
  const newCustomer = req.body
  const createdCustomer = await createCustomer(newCustomer)
  res.status(201).json(createdCustomer)
}

export async function updateCustomerHandler(req: Request<CustomerParams>, res: Response) {
  const customerId = parseInt(req.params.id)
  const updatedCustomerData = req.body

  const updatedCustomer = await updateCustomer(customerId, updatedCustomerData)
  res.json(updatedCustomer)
}