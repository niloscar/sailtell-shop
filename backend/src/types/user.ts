export interface UserCredentials {
  email: string
  password: string
}

export interface User {
  id?: number
  passwordHash?: string
  email: string
  role: 'admin' | 'editor' | 'user'
}

export interface PublicUser {
  id?: number
  fname?: string
  lname?: string
  email: string
  role: 'admin' | 'editor' | 'user'
}

export interface UpdateUser {
  fname?: string
  lname?: string
  email?: string
  password?: string
  role?: 'admin' | 'editor' | 'user'
}