/**
 * Routes for handling user-related API endpoints.
 */

import { Router } from 'express'
import { requireAdmin } from '../middleware/auth.middleware'
import {
  createUserHandler,
  getUserHandler,
  getUsersHandler
} from '../controllers/user.controller'

const userRouter = Router()

userRouter.use(requireAdmin)

userRouter.get('/', getUsersHandler)
userRouter.get('/:id', getUserHandler)
userRouter.post('/', createUserHandler)

export default userRouter
