/**
 * Routes for handling GitHub issues-related API endpoints.
 */

import { Router } from 'express'
import { requireAdmin } from '../middleware/auth.middleware'
import { getIssues, postIssue } from '../controllers/githubIssues.controller'

const githubIssuesRouter = Router()

githubIssuesRouter.use(requireAdmin)

githubIssuesRouter.get('/', getIssues)
githubIssuesRouter.post('/', postIssue)

export default githubIssuesRouter
