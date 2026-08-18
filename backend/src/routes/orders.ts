/**
 * This file defines the routes for handling order-related API endpoints.
 */

import { Router } from 'express'
import products from './products'

const ordersRouter = Router()

/* Mock data for orders. */
  const orders = [
  { id: 1, date: '2026-01-01', sum: 1799 },
  { id: 2, date: '2026-02-01', sum: 1499 },
  { id: 3, date: '2026-03-01', sum: 2899 }
]

const ordersView = orders.map(order => {
  return {
    id: order.id,
    date: order.date,
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
    res.status(404).json({ error: 'Order not found' })
  }
})

export default ordersRouter