/**
 * Routes for searching and indexing products for the search service.
 */

import { Router } from 'express'
import { requireAdmin } from '../middleware/auth.middleware'
import { indexProductsHandler, /* removeIndexedProductHandler, */ searchProductsHandler } from '../controllers/search.controller'

const searchRouter = Router()

searchRouter.post('/index', requireAdmin, indexProductsHandler)
// searchRouter.delete('/index/:sku', requireAdmin, removeIndexedProductHandler)

searchRouter.get('/search', searchProductsHandler)

export default searchRouter
