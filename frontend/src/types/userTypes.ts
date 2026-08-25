export interface UserCredentials {
  email: string
  password: string
}

export interface User {
  id?: number
  fname?: string
  lname?: string
  passwordHash?: string
  email: string
  role: 'admin' | 'editor' | 'user'
}