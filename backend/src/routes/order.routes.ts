/**
 * Routes for handling order-related API endpoints.
 */

import { Router } from 'express'
import { requireAdmin } from '../middleware/auth.middleware'
import {
  getOrderOptionsHandler,
  getOrdersHandler,
  getOrderHandler,
  createOrderHandler,
  updateOrderHandler,
  deleteOrderHandler
} from '../controllers/order.controller'

const orderRouter = Router()

orderRouter.get('/', requireAdmin, getOrdersHandler)
orderRouter.get('/options', getOrderOptionsHandler)
orderRouter.get('/:id', requireAdmin, getOrderHandler)
orderRouter.post('/', createOrderHandler)
orderRouter.patch('/:id', requireAdmin, updateOrderHandler)
orderRouter.delete('/:id', requireAdmin, deleteOrderHandler)

export default orderRouter
