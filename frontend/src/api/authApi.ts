import api from './apiClient'
import type { UserCredentials } from '../types/userTypes'

export function login(credentials: UserCredentials) {
  return api.post('/auth/login', credentials)
}

export function getSession() {
  return api.get('/auth/session')
}

export function logout() {
  return api.post('/auth/logout')
}