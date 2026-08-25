/**
 * Routes for handling price-related API endpoints.
 */

import { Router } from 'express'
import { getPriceHistoryHandler, getPriceHandler, createPriceHandler } from '../controllers/priceController'
import { requireAdmin } from '../middleware/authMiddleware'

const priceRouter = Router({ mergeParams: true })

priceRouter.get('/price', getPriceHandler)
priceRouter.get('/prices', requireAdmin, getPriceHistoryHandler)
priceRouter.post('/price', requireAdmin, createPriceHandler)

export default priceRouter