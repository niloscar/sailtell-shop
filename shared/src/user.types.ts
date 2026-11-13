export type UserRole = 'admin' | 'customer'

export interface UserCredentials {
  email: string
  password: string
}

export interface User {
  id: number
  fname: string | null
  lname: string | null
  email: string
  role: UserRole
}
