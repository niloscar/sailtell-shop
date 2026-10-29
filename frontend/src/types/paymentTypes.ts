export type PaymentResponse = {
  orderId: number
  url: string
}

export type PaymentConfirmation = {
  orderId: number
  status: string
  statusId: number
  items: {
    productId: number
    name: string
    quantity: number
    unitPrice: number
  }[]
  total: number
}
