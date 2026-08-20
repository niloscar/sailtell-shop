import api from './apiClient'

import type { Customer } from '../types/customerTypes'

export function getCustomers() {
  return api.get('/customers')
}

export function getCustomer(id: number) {
  return api.get(`/customers/${id}`)
}

export function createCustomer(customerData: Customer) {
  return api.post('/customers', customerData)
}

export function updateCustomer(id: number, customerData: Customer) {
  return api.patch(`/customers/${id}`, customerData)
}

export function deleteCustomer(id: number) {
  return api.delete(`/customers/${id}`)
}