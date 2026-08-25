/**
 * Routes for handling user-related API endpoints.
 */

import { Router } from 'express'
import { createUserHandler, getUserHandler, getUsersHandler } from '../controllers/userController'
import { requireAdmin } from '../middleware/authMiddleware'

const userRouter = Router()

userRouter.use(requireAdmin)

userRouter.get('/', getUsersHandler)
userRouter.get('/:id', getUserHandler)
userRouter.post('/', createUserHandler)

export default userRouter