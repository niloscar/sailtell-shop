/**
 * Controller functions for handling GitHub OAuth authentication and callback.
 */

import { Request, Response, NextFunction } from 'express'
import { findUserByGitHubId } from '../repositories/user.repository'
import { establishSession } from '../services/session.service'
import {
  getAuthorizeUrl,
  exchangeCode,
  getUser
} from '../integrations/auth/github.adapter'
import { randomString, toCodeChallenge } from '../lib/pkce'

const CLIENT_URL = process.env.CLIENT_URL
const OAUTH_STATE_TTL = 10 * 60 * 1000
const ADMIN_LOGINS = (process.env.ADMIN_GITHUB_LOGINS ?? '')
  .split(',')
  .map((login) => login.trim().toLowerCase())
  .filter(Boolean)

if (!CLIENT_URL) throw new Error('CLIENT_URL saknas i miljövariablerna.')

export function githubLogin(req: Request, res: Response, next: NextFunction) {
  const state = randomString()
  const codeVerifier = randomString()
  const codeChallenge = toCodeChallenge(codeVerifier)

  req.session.githubState = state
  req.session.githubStateExpiresAt = Date.now() + OAUTH_STATE_TTL
  req.session.githubCodeVerifier = codeVerifier

  req.session.save((error) => {
    if (error) return next(error)

    res.redirect(getAuthorizeUrl(state, codeChallenge))
  })
}

export async function githubCallback(req: Request, res: Response) {
  const { code, state, error } = req.query

  const expectedState = req.session.githubState
  const expiresAt = req.session.githubStateExpiresAt
  const codeVerifier = req.session.githubCodeVerifier

  delete req.session.githubState
  delete req.session.githubStateExpiresAt
  delete req.session.githubCodeVerifier

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
    const accessToken = await exchangeCode(code, codeVerifier)
    const githubUser = await getUser(accessToken)

    if (!ADMIN_LOGINS.includes(githubUser.login.toLowerCase())) {
      res.redirect(new URL('/login?error=github-not-admin', CLIENT_URL).toString())
      return
    }

    const user = await findUserByGitHubId(githubUser.id)

    if (!user || user.role !== 'admin') {
      res.redirect(new URL('/login?error=github-not-admin', CLIENT_URL).toString())
      return
    }

    await establishSession(req, user.id, githubUser.login)

    res.redirect(new URL('/admin', CLIENT_URL).toString())
  } catch (err) {
    console.error(err)
    res.redirect(new URL('/login?error=github', CLIENT_URL).toString())
  }
}
