import 'express-session'

declare module 'express-session' {
  interface SessionData {
    userId?: number
    oauthState?: string
    oauthStateExpiresAt?: number
    oauthCodeVerifier?: string
    githubState?: string
    githubStateExpiresAt?: number
    githubCodeVerifier?: string
    githubLogin?: string
  }
}
