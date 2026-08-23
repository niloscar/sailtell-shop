export interface Order {
  id: number
  customer_id: number
  payment_method_id: number
  delivery_method_id: number
  ordered_at: string
  sum: number
}

export interface UpdateOrder {
  payment_method_id?: number
  delivery_method_id?: number
  ordered_at?: string
  sum?: number
}

export interface ShippingAddress {
  id: number
  order_id: number
  address_line1: string
  address_line2?: string
  city: string
  postal_code: string
  country: string
}

export interface UpdateShippingAddress {
  order_id: number
  address_line1: string
  address_line2?: string
  city: string
  postal_code: string
  country: string
}