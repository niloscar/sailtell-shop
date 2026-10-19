/**
 * Routes for handling price-related API endpoints.
 */

import { Router } from 'express'
import {
  getPriceHistoryHandler,
  getPriceHandler,
  createPriceHandler
} from '../controllers/price.controller'
import { requireAdmin } from '../middleware/auth.middleware'

const priceRouter = Router({ mergeParams: true })

priceRouter.get('/price', getPriceHandler)
priceRouter.get('/prices', requireAdmin, getPriceHistoryHandler)
priceRouter.post('/price', requireAdmin, createPriceHandler)

export default priceRouter
