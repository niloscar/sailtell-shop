/**
 * Routes for handling authentication-related API endpoints.
 */

import { Router } from 'express'
import { login, getSession, logout } from '../controllers/auth.controller'
import { googleLogin, googleCallback } from '../controllers/googleAuth.controller'
import { githubLogin, githubCallback } from '../controllers/githubAuth.controller'

const authRouter = Router()

authRouter.post('/login', login)
authRouter.get('/session', getSession)
authRouter.post('/logout', logout)

authRouter.get('/google', googleLogin)
authRouter.get('/google/callback', googleCallback)

authRouter.get('/github', githubLogin)
authRouter.get('/github/callback', githubCallback)

export default authRouter
