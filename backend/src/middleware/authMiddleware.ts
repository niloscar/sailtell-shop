import type { Request, Response, NextFunction } from 'express'
import { getSessionUserId } from '../services/sessionService'
import pool from '../database'
import type { User } from '../types/user'

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const userId = getSessionUserId(req)

  if (!userId) {
    res.status(401).json({ error: 'Du måste vara inloggad.' })
    return
  }

  next()
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const userId = getSessionUserId(req)

  if (!userId) {
    res.status(401).json({ error: 'Du måste vara inloggad.' })
    return
  }

  const { rows } = await pool.query<Pick<User, 'id' | 'role'>>(
    `SELECT
      id,
      role
    FROM users
    WHERE id = $1`,
    [userId]
  )

  const user = rows[0]

  if (!user) {
    res.status(401).json({ error: 'Ogiltig session.' })
    return
  }

  if (user.role !== 'admin') {
    res.status(403).json({ error: 'Du saknar behörighet.' })
    return
  }

  next()
}