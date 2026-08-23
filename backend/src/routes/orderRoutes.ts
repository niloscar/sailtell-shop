/**
 * Routes for handling order-related API endpoints.
 */

import { Router } from 'express'
import { getOrdersHandler, getOrderHandler, createOrderHandler, updateOrderHandler, deleteOrderHandler } from '../controllers/orderController'

const ordersRouter = Router()

ordersRouter.get('/', getOrdersHandler)
ordersRouter.get('/:id', getOrderHandler)
ordersRouter.post('/', createOrderHandler)
ordersRouter.patch('/:id', updateOrderHandler)
ordersRouter.delete('/:id', deleteOrderHandler)

export default ordersRouter