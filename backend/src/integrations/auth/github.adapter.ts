/**
 * Adapter for interacting with the GitHub OAuth and Issues API.
 */

import { z } from 'zod'

const CLIENT_ID = process.env.GITHUB_OAUTH_CLIENT_ID ?? ''
const CLIENT_SECRET = process.env.GITHUB_OAUTH_CLIENT_SECRET ?? ''
const CALLBACK_URL = process.env.GITHUB_OAUTH_CALLBACK_URL ?? ''
const REPO = process.env.GITHUB_REPO ?? ''
const ISSUES_TOKEN = process.env.GITHUB_ISSUES_TOKEN ?? ''

if (!CLIENT_ID || !CLIENT_SECRET || !CALLBACK_URL) throw new Error('Missing GitHub OAuth configuration in environment variables.')

const tokenSchema = z.object({
  access_token: z.string().min(1)
})

const userSchema = z.object({
  id: z.number().int().positive(),
  login: z.string().min(1)
})

const issueSchema = z.object({
  number: z.number().int(),
  title: z.string(),
  html_url: z.url(),
  user: z.object({
    login: z.string()
  }).nullable(),
  pull_request: z.unknown().optional()
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

  if (!response.ok) throw new Error(`Failed to fetch GitHub user (${response.status}).`)

  const answer: unknown = await response.json()

  return userSchema.parse(answer)
}

function getIssuesConfig() {
  if (!REPO || !ISSUES_TOKEN) throw new Error('Missing GitHub Issues configuration.')

  return {
    url: `https://api.github.com/repos/${REPO}/issues`,
    headers: {
      Authorization: `Bearer ${ISSUES_TOKEN}`,
      Accept: 'application/vnd.github+json'
    }
  }
}

// https://docs.github.com/en/rest/issues/issues#create-an-issue
export async function createIssue(title: string, body: string) {
  const { url, headers } = getIssuesConfig()

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title, body }),
    signal: AbortSignal.timeout(5_000)
  })

  if (!response.ok) throw new Error(`Failed to create GitHub issue (${response.status}).`)

  const answer: unknown = await response.json()
  const issue = issueSchema.parse(answer)

  return {
    number: issue.number,
    title: issue.title,
    url: issue.html_url
  }
}

// https://docs.github.com/en/rest/issues/issues#list-repository-issues
export async function listOpenIssues() {
  const { url, headers } = getIssuesConfig()

  const response = await fetch(`${url}?state=open&per_page=100`, {
    headers,
    signal: AbortSignal.timeout(5_000)
  })

  if (!response.ok) throw new Error(`Failed to fetch GitHub issues (${response.status}).`)

  const answer: unknown = await response.json()
  const issues = z.array(issueSchema).parse(answer)

  return issues
    .filter((issue) => !issue.pull_request)
    .map((issue) => ({
      number: issue.number,
      title: issue.title,
      url: issue.html_url,
      author: issue.user?.login ?? 'Unknown'
    }))
}

