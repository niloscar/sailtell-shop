/**
 * Routes for handling cart-related API endpoints.
 */

import { Router } from 'express'
import { createCartHandler, getCartHandler, addCartItemHandler, updateCartItemHandler, deleteCartItemHandler } from '../controllers/cartController'

const router = Router()

router.post('/', createCartHandler)
router.get('/:cartUuid', getCartHandler)
router.post('/:cartUuid/items', addCartItemHandler)
router.patch('/:cartUuid/items/:productId', updateCartItemHandler)
router.delete('/:cartUuid/items/:productId', deleteCartItemHandler)

export default router