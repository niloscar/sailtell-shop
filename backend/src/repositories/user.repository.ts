import pool from '../database'
import type { User } from '../types/user.types'

export async function findUserByEmail(email: string): Promise<User | null> {
  const { rows } = await pool.query<User>(
    `SELECT
      id,
      fname,
      lname,
      email,
      role,
      password_hash
    FROM users
    WHERE LOWER(email) = LOWER($1)`,
    [email]
  )

  return rows[0] ?? null
}