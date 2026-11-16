/**
 * Routes for handling authentication-related API endpoints.
 */

import { Router } from 'express'
import { login, getSession, logout } from '../controllers/auth.controller'
import { getAuthorizeUrl, exchangeCode } from '../integrations/auth/google.adapter'
import { randomString } from '../lib/pkce'

const authRouter = Router()

const OAUTH_STATE_TTL = 10 * 60 * 1000

authRouter.post('/login', login)
authRouter.get('/session', getSession)
authRouter.post('/logout', logout)

authRouter.get('/google', (req, res, next) => {
  const state = randomString()

  req.session.oauthState = state
  req.session.oauthStateExpiresAt = Date.now() + OAUTH_STATE_TTL

  req.session.save((error) => {
    if (error) return next(error)

    res.redirect(getAuthorizeUrl(state))
  })
})

authRouter.get('/google/callback', async (req, res) => {
  const { code, state, error } = req.query
  const expectedState = req.session.oauthState
  const expiresAt = req.session.oauthStateExpiresAt

  delete req.session.oauthState
  delete req.session.oauthStateExpiresAt

  // User cancelled the login flow
  if (error) {
    res.redirect('/login?error=cancelled')
    return
  }

  if (
    typeof code !== 'string' ||
    typeof state !== 'string' ||
    !expectedState ||
    state !== expectedState ||
    !expiresAt ||
    Date.now() >= expiresAt
  ) {
    res.redirect('/login?error=state')
    return
  }

  try {
    const user = await exchangeCode(code)

    if (!user.emailVerified) {
      res.redirect('/login?error=not-verified')
      return
    }

    // Save the information in the customer or user table if the user doesn't exist yet

    // Find the customer by google_sub, never by email, or create a new one if it doesn't exist:
    // insert into customers (google_sub, email, name) … on conflict (google_sub) do update …
    // and put YOUR customer id in the token instead of user.sub.
  } catch (err) {
    console.error(err)
    res.redirect('/login?error=google')
  }
})

export default authRouter
