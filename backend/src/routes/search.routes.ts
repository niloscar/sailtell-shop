/**
 * Routes for searching and indexing products for the search service.
 */

import { Router } from 'express'
import { requireAdmin } from '../middleware/auth.middleware'
import { indexProductsHandler, searchProductsHandler } from '../controllers/search.controller'

const searchRouter = Router()

searchRouter.post('/index', requireAdmin, indexProductsHandler)

searchRouter.get('/', searchProductsHandler)

export default searchRouter
