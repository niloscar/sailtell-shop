import api from './apiClient'

import type { CreateCustomer, UpdateCustomer } from '../types/customerTypes'

export function getCustomers() {
  return api.get('/customers')
}

export function getCustomer(id: number) {
  return api.get(`/customers/${id}`)
}

export function createCustomer(customer: CreateCustomer) {
  return api.post('/customers', customer)
}

export function updateCustomer(id: number, customer: UpdateCustomer) {
  return api.patch(`/customers/${id}`, customer)
}

export function deleteCustomer(id: number) {
  return api.delete(`/customers/${id}`)
}