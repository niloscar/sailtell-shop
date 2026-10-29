/**
 * Routes for handling cart-related API endpoints.
 */

import { Router } from 'express'
import {
  createCartHandler,
  getCartHandler,
  addCartItemHandler,
  updateCartItemHandler,
  deleteCartItemHandler
} from '../controllers/cart.controller'

const cartRouter = Router()

cartRouter.post('/', createCartHandler)
cartRouter.get('/:cartUuid', getCartHandler)
cartRouter.post('/:cartUuid/items', addCartItemHandler)
cartRouter.patch('/:cartUuid/items/:productId', updateCartItemHandler)
cartRouter.delete('/:cartUuid/items/:productId', deleteCartItemHandler)

export default cartRouter
