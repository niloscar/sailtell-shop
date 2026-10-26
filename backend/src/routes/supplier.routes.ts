/**
 * Routes for handling supplier-related API endpoints.
 */


import { Router } from 'express'
import { requireAdmin } from '../middleware/auth.middleware'

import { importSupplierProductsHandler } from '../controllers/supplier.controller'

const supplierRouter = Router()

supplierRouter.post('/import/:format', requireAdmin, importSupplierProductsHandler)

export default supplierRouter
