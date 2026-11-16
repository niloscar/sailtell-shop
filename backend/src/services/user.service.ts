/**
 * User service functions for handling user-related operations such as registration, updates and deletes.
 */

import bcrypt from 'bcrypt'
import pool from '../database'
import {
  createGoogleUser,
  findUserByEmail,
  findUserByGoogleSub
} from '../repositories/user.repository'
import type { PublicUser, User, UpdateUser } from '../types/user.types'

type GoogleProfile = {
  sub: string
  email: string
  fname: string | null
  lname: string | null
}

export function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

export async function getUsers() {
  const { rows } = await pool.query<PublicUser>(
    `SELECT id, fname, lname, email, role 
      FROM users`
  )

  if (rows.length === 0) throw new Error('Inga användare kunde hittas.')

  return rows
}

export async function getUser(id: number) {
  const { rows } = await pool.query<PublicUser>(
    `SELECT id, fname, lname, email, role 
      FROM users 
      WHERE id = $1`,
    [id]
  )

  if (rows.length === 0) throw new Error('Användaren kunde inte hittas.')

  return rows[0]
}

export async function createUser(
  fname: string,
  lname: string,
  email: string,
  password: string,
  role: User['role']
) {
  const passwordHash = await hashPassword(password)

  const { rows } = await pool.query<PublicUser>(
    `INSERT INTO users (fname, lname, email, password_hash, role) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING id, fname, lname, email, role`,
    [fname, lname, email, passwordHash, role]
  )

  return rows[0]
}

const columnMap = {
  fname: 'fname',
  lname: 'lname',
  email: 'email',
  role: 'role',
  password: 'password_hash'
} as const

export async function findOrCreateGoogleUser(profile: GoogleProfile) {
  const user = await findUserByGoogleSub(profile.sub)

  if (user) return user

  if (await findUserByEmail(profile.email))
    throw new Error('GOOGLE_EMAIL_CONFLICT')

  try {
    return await createGoogleUser(
      profile.sub,
      profile.email,
      profile.fname,
      profile.lname
    )
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === '23505') {
      const user = await findUserByGoogleSub(profile.sub)

      if (user) return user

      if ('constraint' in error && error.constraint === 'users_email_key') {
        throw new Error('GOOGLE_EMAIL_CONFLICT')
      }
    }

    throw error
  }
}
