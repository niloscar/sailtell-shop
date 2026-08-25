/**
 * Routes for handling order-related API endpoints.
 */

import { Router } from 'express'
import { getOrderOptionsHandler, getOrdersHandler, getOrderHandler, createOrderHandler, updateOrderHandler, deleteOrderHandler } from '../controllers/orderController'

const orderRouter = Router()

orderRouter.get('/', getOrdersHandler)
orderRouter.get('/options', getOrderOptionsHandler)
orderRouter.get('/:id', getOrderHandler)

orderRouter.post('/', createOrderHandler)
orderRouter.patch('/:id', updateOrderHandler)
orderRouter.delete('/:id', deleteOrderHandler)

export default orderRouter