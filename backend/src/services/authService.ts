/**
 * Authentication service functions for handling user login, session management, and logout.
 * 
 * Todo:
 * - Implement password hashing and verification for secure authentication.
 */

import bcrypt from 'bcrypt'
import { User } from '../types/user'
import pool from '../database'

type PublicUser = Omit<User, 'passwordHash'>

type LoginResult = {
    user: PublicUser
}

export async function loginUser(email: string, password: string): Promise<LoginResult> {
    const { rows } = await pool.query(
        `SELECT
        id,
        email,
        role,
        password_hash as "passwordHash"
        FROM users 
        WHERE LOWER(email) = LOWER($1)`, [email])

    const user = rows[0]

    const passwordMatches = await bcrypt.compare(password, user.passwordHash)

    if (!user || !passwordMatches) {
        throw new Error('Fel användarnamn eller lösenord')
    }

    return {
        user: {
            id: user.id,
            email: user.email,
            role: user.role
        }
    }
}