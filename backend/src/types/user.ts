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