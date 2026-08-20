/**
 * Routes for handling order-related API endpoints.
 */

import { Router } from 'express'
import { getOrders, getOrder, createOrder, updateOrder, deleteOrder } from '../controllers/orderController'

const ordersRouter = Router()

ordersRouter.get('/', getOrders)
ordersRouter.get('/:id', getOrder)
ordersRouter.post('/', createOrder)
ordersRouter.patch('/:id', updateOrder)
ordersRouter.delete('/:id', deleteOrder)

export default ordersRouter