import api from './apiClient'
import type { CreateOrder, UpdateOrder, OrderDetails } from '../types/orderTypes'

export function getOrderOptions() {
  return api.get('/orders/options')
}

export function getOrders() {
  return api.get('/orders')
}

export function getOrder(id: number) {
  return api.get<OrderDetails>(`/orders/${id}`)
}

export function createOrder(orderData: CreateOrder) {
  return api.post('/orders', orderData)
}

export function updateOrder(id: number, orderData: UpdateOrder) {
  return api.patch(`/orders/${id}`, orderData)
}

export function deleteOrder(id: number) {
  return api.delete(`/orders/${id}`)
}
