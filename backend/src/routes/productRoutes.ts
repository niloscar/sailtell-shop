/**
 * Routes for handling product-related API endpoints.
 */

import { Router } from 'express'
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController'

const productsRouter = Router()

productsRouter.get('/', getProducts)
productsRouter.get('/:id', getProduct)
productsRouter.post('/', createProduct)
productsRouter.patch('/:id', updateProduct)
productsRouter.delete('/:id', deleteProduct)

export default productsRouter