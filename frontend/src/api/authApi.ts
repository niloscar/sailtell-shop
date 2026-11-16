import api from './apiClient'
import type { UserCredentials, User } from '@shop/shared'

export async function loginUser(credentials: UserCredentials) {
  const response = await api.post<{ user: User }>('/auth/login', credentials)
  return response.data
}

export async function getSession() {
  const response = await api.get<{ user: User }>('/auth/session')
  return response.data
}

export function logoutUser() {
  return api.post('/auth/logout')
}
