/**
 * Routes for handling user-related API endpoints.
 */

import { Router } from 'express'
import { createUserHandler, updateUserHandler, getUserHandler, getUsersHandler } from '../controllers/userController'

const usersRouter = Router()

usersRouter.get('/', getUsersHandler)
usersRouter.get('/:id', getUserHandler)
usersRouter.post('/', createUserHandler)
usersRouter.patch('/:id', updateUserHandler)

export default usersRouter