/**
 * This file defines the routes for handling order-related API endpoints.
 */

import { Router } from 'express'
import { mockOrders } from '../data/mockdata'

const ordersRouter = Router()

/* Mock data for orders. */
  const orders = mockOrders

const ordersView = orders.map(order => {
  return {
    id: order.id,
    date: order.ordered_at,
    sum: order.sum
  }
})

/* GET /api/orders - Get all orders */
ordersRouter.get('/', (req, res) => {
  res.json(orders)
})

/* GET /api/orders/:id - Get an order by ID */
ordersRouter.get('/:id', (req, res) => {
  const orderId = parseInt(req.params.id)
  const order = orders.find(order => order.id === orderId)

  if (order) {
    res.json(order)
  } else {
    res.status(404).json({ error: 'Ordern kunde inte hittas.' })
  }
})

/* POST /api/orders - Create a new order */
ordersRouter.post('/', (req, res) => {
  const newOrder = req.body
  orders.push(newOrder)
  res.status(201).json(newOrder)
})

/* PATCH /api/orders/:id - Update an order by ID */
ordersRouter.patch('/:id', (req, res) => {
  const orderId = parseInt(req.params.id)
  const orderIndex = orders.findIndex(order => order.id === orderId)

  if (orderIndex !== -1) {
    const updatedOrder = { ...orders[orderIndex], ...req.body }
    orders[orderIndex] = updatedOrder
    res.json(updatedOrder)
  } else {
    res.status(404).json({ error: 'Ordern kunde inte hittas.' })
  }
})

/* DELETE /api/orders/:id - Delete an order by ID */
ordersRouter.delete('/:id', (req, res) => {
  const orderId = parseInt(req.params.id)
  const orderIndex = orders.findIndex(order => order.id === orderId)

  if (orderIndex !== -1) {
    orders.splice(orderIndex, 1)
    res.status(204).send()
  } else {
    res.status(404).json({ error: 'Ordern kunde inte hittas.' })
  }
})

export default ordersRouter