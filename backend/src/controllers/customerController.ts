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

  if (customers) {
    res.json(customers)
  } else {
    res.status(404).json({ error: 'Inga kunder hittades.' })
  }
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

  if (createdCustomer) {
    res.status(201).json(createdCustomer)
  } else {
    res.status(400).json({ error: 'Kunden kunde inte skapas.' })
  }
}

export async function updateCustomerHandler(req: Request<CustomerParams>, res: Response) {
  const customerId = parseInt(req.params.id)
  const updatedCustomerData = req.body

  const updatedCustomer = await updateCustomer(customerId, updatedCustomerData)

  if (updatedCustomer) {
    res.json(updatedCustomer)
  } else {
    res.status(404).json({ error: 'Kunden kunde inte uppdateras.' })
  }
}