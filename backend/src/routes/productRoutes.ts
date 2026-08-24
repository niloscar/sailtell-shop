/**
 * Routes for handling product-related API endpoints.
 */

import { Router } from 'express'
import { getProductHandler, deleteProductHandler, updateProductHandler, createProductHandler, getAllProductsHandler, getProductsByCategoryHandler } from '../controllers/productController'
import priceRouter from './priceRoutes'

const productRouter = Router()

productRouter.get('/', getAllProductsHandler)
productRouter.get('/category/:categorySlug', getProductsByCategoryHandler)

productRouter.use('/:productId', priceRouter)

productRouter.get('/:id', getProductHandler)

productRouter.post('/', createProductHandler)
productRouter.patch('/:id', updateProductHandler)
productRouter.delete('/:id', deleteProductHandler)

export default productRouter