/**
 * Controller functions for handling order-related API endpoints.
 */

import { Request, Response } from 'express'
import { mockOrders as orders } from '../data/mockdata'

type OrderParams = {
  id: string
}

export async function getOrders(req: Request, res: Response) {
  res.json(orders)
}

export async function getOrder(req: Request<OrderParams>, res: Response) {
  const orderId = parseInt(req.params.id)
  const order = orders.find(order => order.id === orderId)

  if (order) {
    res.json(order)
  } else {
    res.status(404).json({ error: 'Ordern kunde inte hittas.' })
  }
}

export async function createOrder(req: Request, res: Response) {
  const newOrder = req.body
  orders.push(newOrder)
  res.status(201).json(newOrder)
}

export async function updateOrder(req: Request<OrderParams>, res: Response) {
  const orderId = parseInt(req.params.id)
  const orderIndex = orders.findIndex(order => order.id === orderId)

  if (orderIndex !== -1) {
    const updatedOrder = { ...orders[orderIndex], ...req.body }
    orders[orderIndex] = updatedOrder
    res.json(updatedOrder)
  } else {
    res.status(404).json({ error: 'Ordern du vill ändra kunde inte hittas.' })
  }
}

export async function deleteOrder(req: Request<OrderParams>, res: Response) {
  const orderId = parseInt(req.params.id)
  const orderIndex = orders.findIndex(order => order.id === orderId)

  if (orderIndex !== -1) {
    orders.splice(orderIndex, 1)
    res.status(204).send()
  } else {
    res.status(404).json({ error: 'Ordern du vill ta bort kunde inte hittas.' })
  }
}