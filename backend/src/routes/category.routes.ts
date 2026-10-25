/**
 * Routes for handling category-related API endpoints.
 */

import { Router } from 'express'
import { requireAdmin } from '../middleware/auth.middleware'
import {
  getCategoriesHandler,
  getCategoryHandler,
  createCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler
} from '../controllers/category.controller'

const categoryRouter = Router()

categoryRouter.get('/', getCategoriesHandler)
categoryRouter.get('/:id', getCategoryHandler)

categoryRouter.post('/', requireAdmin, createCategoryHandler)
categoryRouter.patch('/:id', requireAdmin, updateCategoryHandler)
categoryRouter.delete('/:id', requireAdmin, deleteCategoryHandler)

export default categoryRouter
