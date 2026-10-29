import api from './apiClient'
import type { CreateOrder } from '../types/orderTypes'

type PaymentResponse = {
  orderId: number
  url: string
}

export function createPayment(orderData: CreateOrder) {
  return api.post<PaymentResponse>('/payment/checkout', orderData)
}
