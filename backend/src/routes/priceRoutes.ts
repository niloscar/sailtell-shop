/**
 * Routes for handling price-related API endpoints.
 */

import { Router } from 'express'
import { getPriceHistoryHandler, getPriceHandler, createPriceHandler } from '../controllers/priceController'

const priceRouter = Router({ mergeParams: true })

priceRouter.get('/price', getPriceHandler)
priceRouter.get('/prices', getPriceHistoryHandler)
priceRouter.post('/price', createPriceHandler)

export default priceRouter