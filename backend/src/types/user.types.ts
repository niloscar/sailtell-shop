import type { User as SharedUser, UserRole } from '@shop/shared'

export type {
  UserRole,
  UserCredentials,
  User as PublicUser
} from '@shop/shared'

export interface User extends SharedUser {
  password_hash: string | null
}

export interface UpdateUser {
  fname?: string
  lname?: string
  email?: string
  password?: string
  role?: UserRole
}
