import { Request, Response, NextFunction } from 'express'
import { findOrCreateGoogleUser } from '../services/user.service'
import { establishSession } from '../services/session.service'
import {
  getAuthorizeUrl,
  exchangeCode
} from '../integrations/auth/google.adapter'
import { randomString, toCodeChallenge } from '../lib/pkce'

const CLIENT_URL = process.env.CLIENT_URL
const OAUTH_STATE_TTL = 10 * 60 * 1000

if (!CLIENT_URL) throw new Error('CLIENT_URL saknas i miljövariablerna.')

export function googleLogin(req: Request, res: Response, next: NextFunction) {
  const state = randomString()
  const codeVerifier = randomString()
  const codeChallenge = toCodeChallenge(codeVerifier)

  req.session.oauthState = state
  req.session.oauthStateExpiresAt = Date.now() + OAUTH_STATE_TTL
  req.session.oauthCodeVerifier = codeVerifier

  req.session.save((error) => {
    if (error) return next(error)

    res.redirect(getAuthorizeUrl(state, codeChallenge))
  })
}

export async function googleCallback(req: Request, res: Response) {
  const { code, state, error } = req.query

  const expectedState = req.session.oauthState
  const expiresAt = req.session.oauthStateExpiresAt
  const codeVerifier = req.session.oauthCodeVerifier

  delete req.session.oauthState
  delete req.session.oauthStateExpiresAt
  delete req.session.oauthCodeVerifier

  // User cancelled the login flow
  if (error) {
    res.redirect(new URL('/login?error=cancelled', CLIENT_URL).toString())
    return
  }

  if (
    typeof code !== 'string' ||
    typeof state !== 'string' ||
    !expectedState ||
    state !== expectedState ||
    !expiresAt ||
    Date.now() >= expiresAt ||
    !codeVerifier
  ) {
    res.redirect(new URL('/login?error=state', CLIENT_URL).toString())
    return
  }

  try {
    const googleUser = await exchangeCode(code, codeVerifier)

    if (!googleUser.emailVerified) {
      res.redirect(new URL('/login?error=not-verified', CLIENT_URL).toString())
      return
    }

    const user = await findOrCreateGoogleUser(googleUser)

    await establishSession(req, user.id)

    res.redirect(new URL('/my-account', CLIENT_URL).toString())
  } catch (err) {
    if (err instanceof Error && err.message === 'GOOGLE_EMAIL_CONFLICT') {
      res.redirect(
        new URL('/login?error=email-conflict', CLIENT_URL).toString()
      )
      return
    }

    console.error(err)
    res.redirect(new URL('/login?error=google', CLIENT_URL).toString())
  }
}
