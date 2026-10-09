// services/auth.service.ts

import bcrypt from 'bcrypt'
import { findUserByEmail } from '../repositories/user.repository'
import type { PublicUser } from '../types/user.types'

type LoginResult = {
  user: PublicUser
}

export async function loginUser(email: string, password: string): Promise<LoginResult> {
  const user = await findUserByEmail(email)

  if (!user) {
    throw new Error('Fel användarnamn eller lösenord')
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash)

  if (!passwordMatches) {
    throw new Error('Fel användarnamn eller lösenord')
  }

  return {
    user: {
      id: user.id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      role: user.role
    }
  }
}