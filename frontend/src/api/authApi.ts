import api from './apiClient'
import type { UserCredentials } from '../types/userTypes'

export function loginUser(credentials: UserCredentials) {
  return api.post('/auth/login', credentials)
}

export function getSession() {
  return api.get('/auth/session')
}

export function logoutUser() {
  return api.post('/auth/logout')
}