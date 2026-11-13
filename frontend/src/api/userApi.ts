import api from './apiClient'
import type { User } from '@shop/shared'

export function getUsers() {
  return api.get('/users')
}

export function getUser(id: number) {
  return api.get(`/users/${id}`)
}

export function updateUser(id: number, userData: User) {
  return api.patch(`/users/${id}`, userData)
}
