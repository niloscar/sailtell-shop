import api from './apiClient'
import type { CreateOrder } from '../types/orderTypes'
import type { PaymentConfirmation, PaymentResponse } from '../types/paymentTypes'

export function createPayment(orderData: CreateOrder) {
  return api.post<PaymentResponse>('/payment/checkout', orderData)
}

export function getPaymentConfirmation(sessionId: string) {
  return api.get<PaymentConfirmation>('/payment/confirmation', {
    params: { session_id: sessionId }
  })
}
