/**
 * Routes for handling product-related API endpoints.
 */

import { Router } from 'express'
import { getProductHandler, deleteProductHandler, updateProductHandler, createProductHandler, getProductsHandler } from '../controllers/productController'
import priceRouter from './priceRoutes'

const productRouter = Router()

productRouter.get('/', getProductsHandler)
productRouter.post('/', createProductHandler)

productRouter.use('/:productId', priceRouter)

productRouter.get('/:id', getProductHandler)
productRouter.patch('/:id', updateProductHandler)
productRouter.delete('/:id', deleteProductHandler)

export default productRouter