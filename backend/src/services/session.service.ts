import type { Request } from 'express'

export function setSessionUserId(req: Request, userId: number | undefined) {
  if (!userId) {
    delete req.session.userId
    return
  }

  req.session.userId = userId
}

export function getSessionUserId(req: Request): number | null {
  return req.session.userId ?? null
}

export function clearSession(req: Request) {
  return new Promise<void>((resolve, reject) => {
    req.session.destroy((error) => {
      if (error) {
        reject(error)
        return
      }

      resolve()
    })
  })
}

export function regenerateSession(req: Request): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) {
        reject(error)
        return
      }

      resolve()
    })
  })
}

export async function establishSession(req: Request, userId: number, githubLogin?: string): Promise<void> {
  await regenerateSession(req)

  setSessionUserId(req, userId)
  if (githubLogin) req.session.githubLogin = githubLogin

  await new Promise<void>((resolve, reject) => {
    req.session.save((error) => {
      if (error) {
        reject(error)
        return
      }

      resolve()
    })
  })
}
