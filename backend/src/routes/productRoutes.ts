/**
 * Routes for handling product-related API endpoints.
 */

import { Router } from 'express'
import { getProductHandler, deleteProductHandler, updateProductHandler, createProductHandler, getProductsHandler } from '../controllers/productController'

const productsRouter = Router()

productsRouter.get('/', getProductsHandler)
productsRouter.get('/:id', getProductHandler)
productsRouter.post('/', createProductHandler)
productsRouter.patch('/:id', updateProductHandler)
productsRouter.delete('/:id', deleteProductHandler)

export default productsRouter