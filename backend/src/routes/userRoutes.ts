/**
 * Routes for handling user-related API endpoints.
 */

import { Router } from 'express'
import { getUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/userController'

const usersRouter = Router()

usersRouter.get('/', getUsers)
usersRouter.get('/:id', getUser)
usersRouter.patch('/:id', updateUser)

export default usersRouter