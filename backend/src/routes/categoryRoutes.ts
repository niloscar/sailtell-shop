/**
 * Routes for handling category-related API endpoints.
 */

import { Router } from 'express'
import { getCategoriesHandler, getCategoryHandler, createCategoryHandler, updateCategoryHandler, deleteCategoryHandler } from '../controllers/categoryController'

const categoryRouter = Router()

categoryRouter.get('/', getCategoriesHandler)
categoryRouter.get('/:id', getCategoryHandler)
categoryRouter.post('/', createCategoryHandler)
categoryRouter.patch('/:id', updateCategoryHandler)
categoryRouter.delete('/:id', deleteCategoryHandler)

export default categoryRouter