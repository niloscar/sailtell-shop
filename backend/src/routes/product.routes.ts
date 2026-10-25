/**
 * Routes for handling product-related API endpoints.
 */

import { Router } from 'express'
import {
  getProductHandler,
  deleteProductHandler,
  updateProductHandler,
  createProductHandler,
  getAllProductsHandler,
  getAllSupplierProductsHandler,
  getProductsByCategoryHandler,
  getProductOptionsHandler
} from '../controllers/product.controller'
import priceRouter from './price.routes'
import { requireAdmin } from '../middleware/auth.middleware'

const productRouter = Router()

productRouter.get('/', getAllProductsHandler)
productRouter.get('/supplier', getAllSupplierProductsHandler)
productRouter.get('/category/:categorySlug', getProductsByCategoryHandler)
productRouter.get('/options', getProductOptionsHandler)

productRouter.use('/:productId', priceRouter)

productRouter.get('/:id', getProductHandler)

productRouter.post('/', requireAdmin, createProductHandler)

productRouter.patch('/:id', requireAdmin, updateProductHandler)

productRouter.delete('/:id', requireAdmin, deleteProductHandler)

export default productRouter
