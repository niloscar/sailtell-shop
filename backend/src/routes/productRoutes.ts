/**
 * Routes for handling product-related API endpoints.
 */

import { Router } from 'express'
import { getProductHandler, deleteProductHandler, updateProductHandler, createProductHandler, getAllProductsHandler, getProductsByCategoryHandler, getProductOptionsHandler } from '../controllers/productController'
import priceRouter from './priceRoutes'
import { requireAdmin } from '../middleware/authMiddleware'

const productRouter = Router()

productRouter.get('/', getAllProductsHandler)
productRouter.get('/category/:categorySlug', getProductsByCategoryHandler)
productRouter.get('/options', getProductOptionsHandler)

productRouter.use('/:productId', priceRouter)

productRouter.get('/:id', getProductHandler)

productRouter.post(
  '/',
  requireAdmin,
  createProductHandler
)

productRouter.patch(
  '/:id',
  requireAdmin,
  updateProductHandler
)

productRouter.delete(
  '/:id',
  requireAdmin,
  deleteProductHandler
)

export default productRouter