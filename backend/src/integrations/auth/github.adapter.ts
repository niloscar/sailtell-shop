import { z } from 'zod'

const CLIENT_ID = process.env.GITHUB_OAUTH_CLIENT_ID ?? ''
const CLIENT_SECRET = process.env.GITHUB_OAUTH_CLIENT_SECRET ?? ''
const CALLBACK_URL = process.env.GITHUB_OAUTH_CALLBACK_URL ?? ''

if (!CLIENT_ID || !CLIENT_SECRET || !CALLBACK_URL) {
  throw new Error('Missing GitHub OAuth configuration in environment variables.')
}

const tokenSchema = z.object({
  access_token: z.string().min(1)
})

const userSchema = z.object({
  id: z.number().int().positive(),
  login: z.string().min(1)
})

export function getAuthorizeUrl(state: string, codeChallenge: string) {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: CALLBACK_URL,
    scope: 'read:user',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256'
  })

  return `https://github.com/login/oauth/authorize?${params}`
}

export async function exchangeCode(code: string, codeVerifier: string): Promise<string> {
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: CALLBACK_URL,
      code_verifier: codeVerifier
    }),
    signal: AbortSignal.timeout(5_000)
  })

  const answer: unknown = await response.json()
  const result = tokenSchema.safeParse(answer)

  if (!response.ok || !result.success) {
    throw new Error('Failed to exchange GitHub authorization code.')
  }

  return result.data.access_token
}

export async function getUser(accessToken: string) {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github+json'
    },
    signal: AbortSignal.timeout(5_000)
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub user (${response.status}).`)
  }

  const answer: unknown = await response.json()

  return userSchema.parse(answer)
}
