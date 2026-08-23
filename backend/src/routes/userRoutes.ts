/**
 * Routes for handling user-related API endpoints.
 */

import { Router } from 'express'
import { createUserHandler, getUserHandler, getUsersHandler } from '../controllers/userController'

const userRouter = Router()

userRouter.get('/', getUsersHandler)
userRouter.get('/:id', getUserHandler)
userRouter.post('/', createUserHandler)

export default userRouter