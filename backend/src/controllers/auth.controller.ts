/**
 * Controller functions for handling authentication-related API endpoints.
 */

import { Request, Response } from 'express'
import { loginUser } from '../services/auth.service'
import { getUser } from '../services/user.service'
import {
  clearSession,
  getSessionUserId,
  establishSession
} from '../services/session.service'

export async function login(req: Request, res: Response) {
  const { email, password } = req.body

  if (typeof email !== 'string' || typeof password !== 'string' ||
      !email.trim() || !password) {
    res.status(400).json({ error: 'E-post och lösenord krävs.' })
    return
  }

  let loginResult

  try {
    loginResult = await loginUser(email, password)
  } catch {
    res.status(401).json({ error: 'Felaktig e-post eller lösenord.' })
    return
  }

  try {
    await establishSession(req, loginResult.user.id)

    res.json(loginResult)
  } catch (error) {
    console.error('Kunde inte skapa session:', error)
    res.status(500).json({ error: 'Kunde inte skapa session.' })
  }
}

export async function getSession(req: Request, res: Response) {
  const userId = getSessionUserId(req)

  if (!userId) {
    res.status(401).json({ error: 'Inte inloggad.' })
    return
  }

  const user = await getUser(userId)

  res.json({ user })
}

export async function logout(req: Request, res: Response) {
  try {
    await clearSession(req)

    res.clearCookie('connect.sid') // Clear the session cookie on the client side
    res.json({ message: 'Utloggad.' })
  } catch {
    res.status(500).json({ error: 'Kunde inte logga ut.' })
  }
}
