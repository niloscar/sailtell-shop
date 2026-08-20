/**
 * Controller functions for handling authentication-related API endpoints.
 */

import { Request, Response } from 'express'
import { loginUser } from '../services/authService'
import { clearSession, setSessionUserId, getSessionUserId } from '../services/sessionService'

export async function login(req: Request, res: Response) {
  const { email, password } = req.body

  if (!email || !password) {
      res.status(400).json({ error: 'E-post och lösenord krävs.' })
      return
  }

  try {
      const loginResult = await loginUser(email, password)

      setSessionUserId(req, loginResult.user.id) // Store the user ID in the session to keep the user logged in

      res.json(loginResult)
  } catch (error) {
      const message = (error instanceof Error)
          ? error.message
          : 'Inloggningen misslyckades.'

      res.status(401).json({ error: message })
  }
}

export async function getSession(req: Request, res: Response) {
  res.json({ "userId": getSessionUserId(req) }) // Return the userId from the session, or null if not logged in.
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