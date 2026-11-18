/**
 * Adapter for interacting with the Google OAuth service.
 */

import jwt from 'jsonwebtoken'

const CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID ?? ''
const CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? ''
const CALLBACK_URL = process.env.GOOGLE_OAUTH_CALLBACK_URL ?? ''

if (!CLIENT_ID || !CLIENT_SECRET || !CALLBACK_URL) {
  throw new Error('Missing Google OAuth configuration in environment variables.')
}

export function getAuthorizeUrl(state: string, codeChallenge: string) {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: 'openid email profile',
    redirect_uri: CALLBACK_URL,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    prompt: 'select_account'
  })

  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}

export async function exchangeCode(code: string, codeVerifier: string) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      code_verifier: codeVerifier,
      grant_type: 'authorization_code',
      redirect_uri: CALLBACK_URL
    }),
    signal: AbortSignal.timeout(5_000),
  })

  const answer: unknown = await response.json()

  if (!response.ok) {
    if (answer && typeof answer === 'object') {
      const error = 'error' in answer ? answer.error : undefined
      const description = 'error_description' in answer ? answer.error_description : undefined

      console.error('Google OAuth error:', { error, description })
    }

    throw new Error(`Failed to exchange Google authorization code (${response.status}).`)
  }

  if (
    !answer ||
    typeof answer !== 'object' ||
    !('id_token' in answer) ||
    typeof answer.id_token !== 'string'
  ) {
    throw new Error('Invalid Google token response.')
  }

  // The ID token comes directly from Google's HTTPS token endpoint.
  const claims = jwt.decode(answer.id_token)

  if (!claims || typeof claims === 'string') {
    throw new Error('Invalid Google ID token.')
  }

  if (claims.iss !== 'https://accounts.google.com' && claims.iss !== 'accounts.google.com') {
    throw new Error('The ID token is not issued by Google.')
  }

  if (claims.aud !== CLIENT_ID) {
    throw new Error('The ID token is not meant for this application.')
  }

  if (typeof claims.exp !== 'number' || claims.exp * 1000 <= Date.now()) {
    throw new Error('The ID token has expired or has no valid expiration.')
  }

  if (
    typeof claims.sub !== 'string' ||
    !claims.sub ||
    typeof claims.email !== 'string' ||
    !claims.email ||
    typeof claims.email_verified !== 'boolean'
  ) {
    throw new Error('Invalid Google user information.')
  }

  return {
    sub: claims.sub,
    email: claims.email,
    emailVerified: claims.email_verified,
    fname: typeof claims.given_name === 'string' ? claims.given_name : null,
    lname: typeof claims.family_name === 'string' ? claims.family_name : null
  }
}
