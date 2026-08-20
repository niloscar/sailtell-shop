import api from './apiClient'
import type { Order } from '../types/orderTypes'


export function getOrders() {
  return api.get('/orders')
}

export function getOrderById(id: number) {
  return api.get(`/orders/${id}`)
}

export function createOrder(orderData: Order) {
  return api.post('/orders', orderData)
}

export function updateOrder(id: number, orderData: Order) {
  return api.patch(`/orders/${id}`, orderData)
}

export function deleteOrder(id: number) {
  return api.delete(`/orders/${id}`)
}