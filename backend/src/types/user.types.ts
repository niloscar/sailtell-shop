export type UserRole = 'admin' | 'editor' | 'user'

export interface UserCredentials {
  email: string
  password: string
}

export interface User {
  id: number
  fname: string
  lname: string
  email: string
  role: UserRole
  password_hash: string
}

export type PublicUser = Omit<User, 'password_hash'>

export interface UpdateUser {
  fname?: string
  lname?: string
  email?: string
  password?: string
  role?: UserRole
}