/**
 * Controller functions for handling customer-related API endpoints.
 */

import { Request, Response } from 'express'
import { mockCustomers as customers } from '../data/mockdata'

type CustomerParams = {
  id: string
}

export async function getCustomers(req: Request, res: Response) {
  res.json(customers)
}

export async function getCustomer(req: Request<CustomerParams>, res: Response) {
  const customerId = parseInt(req.params.id)
  const customer = customers.find(customer => customer.id === customerId)

  if (customer) {
    res.json(customer)
  } else {
    res.status(404).json({ error: 'Kunden kunde inte hittas.' })
  }
}

export async function createCustomer(req: Request, res: Response) {
  const newCustomer = req.body
  customers.push(newCustomer)
  res.status(201).json(newCustomer)
}

export async function updateCustomer(req: Request<CustomerParams>, res: Response) {
  const customerId = parseInt(req.params.id)
  const customerIndex = customers.findIndex(customer => customer.id === customerId)

  if (customerIndex !== -1) {
    const updatedCustomer = { ...customers[customerIndex], ...req.body }
    customers[customerIndex] = updatedCustomer
    res.json(updatedCustomer)
  } else {
    res.status(404).json({ error: 'Kunden du vill ändra kunde inte hittas.' })
  }
}

export async function deleteCustomer(req: Request<CustomerParams>, res: Response) {
  const customerId = parseInt(req.params.id)
  const customerIndex = customers.findIndex(customer => customer.id === customerId)

  if (customerIndex !== -1) {
    customers.splice(customerIndex, 1)
    res.json({ message: 'Kunden har tagits bort.' })
  } else {
    res.status(404).json({ error: 'Kunden du vill ta bort kunde inte hittas.' })
  }
}