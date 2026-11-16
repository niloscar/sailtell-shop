
import jwt from 'jsonwebtoken'

const CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID ?? ''
const CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? ''
const CALLBACK_URL = process.env.GOOGLE_OAUTH_CALLBACK_URL ?? ''

if (!CLIENT_ID || !CLIENT_SECRET || !CALLBACK_URL) {
  throw new Error('Missing Google OAuth configuration in environment variables.')
}

export function getAuthorizeUrl(state: string) {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: 'openid email profile',
    redirect_uri: CALLBACK_URL,
    state,
  })

  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}

export async function exchangeCode(code: string) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: CALLBACK_URL,
    }),
    signal: AbortSignal.timeout(5_000),
  })

  if (!response.ok) {
    throw new Error(`Failed to exchange Google authorization code (${response.status}).`)
  }

  const answer: unknown = await response.json()

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
    name: typeof claims.name === 'string' ? claims.name : claims.email,
  }
}
