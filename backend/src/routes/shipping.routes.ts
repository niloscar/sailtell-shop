import { Router } from 'express'
import {
  getDeliveryEstimatesHandler,
  getServicePointsHandler,
  getShippingPricesHandler
} from '../controllers/shipping.controller'

const shippingRouter = Router()

shippingRouter.get('/service-points', getServicePointsHandler)
shippingRouter.get('/delivery-estimates', getDeliveryEstimatesHandler)
shippingRouter.get('/prices/:cartUuid', getShippingPricesHandler)

export default shippingRouter
