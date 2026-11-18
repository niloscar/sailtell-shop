import pool from '../database'
import type { User, PublicUser } from '../types/user.types'

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

export async function findUserByGoogleSub(googleSub: string): Promise<PublicUser | null> {
  const { rows } = await pool.query<PublicUser>(
    `SELECT id, fname, lname, email, role
     FROM users
     WHERE google_sub = $1`,
    [googleSub]
  )

  return rows[0] ?? null
}

export async function createGoogleUser(googleSub: string, email: string, fname: string | null, lname: string | null): Promise<PublicUser> {
  const { rows } = await pool.query<PublicUser>(
    `INSERT INTO users (google_sub, email, fname, lname, role)
     VALUES ($1, $2, $3, $4, 'customer')
     RETURNING id, fname, lname, email, role`,
    [googleSub, email, fname, lname]
  )

  const user = rows[0]

  if (!user) throw new Error('Failed to create Google user.')

  return user
}

export async function findUserByGitHubId(githubId: number): Promise<PublicUser | null> {
  const { rows } = await pool.query<PublicUser>(
    `SELECT id, fname, lname, email, role
     FROM users
     WHERE github_id = $1`,
    [githubId]
  )

  return rows[0] ?? null
}
