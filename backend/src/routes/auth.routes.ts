/**
 * Routes for handling authentication-related API endpoints.
 */

import { Router } from 'express'
import { login, getSession, logout } from '../controllers/auth.controller'

const authRouter = Router()

authRouter.post('/login', login)
authRouter.get('/session', getSession)
authRouter.post('/logout', logout)

export default authRouter
