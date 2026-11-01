export interface Order {
  id: number
  customer_id: number
  ordered_at: string
  sum: number
  order_items: OrderItem[]
  payment_method: PaymentMethod
  delivery_method: DeliveryMethod
  shipping_address: ShippingAddress
  order_status: Status
  shipping_price: number
  service_point_id: string | null
  service_point_name: string | null
}

export type CreateOrder = {
  customer: {
    fname: string
    lname: string
    email: string
    phone: string
  }
  payment_method_id: number
  delivery_method_id: number
  servicePointId?: string
  ordered_at?: string
  shipping_address: {
    fname: string
    lname: string
    street: string
    city: string
    zipcode: string
    country: string
  }
  order_items: {
    product_id: number
    quantity: number
  }[]
}

export interface UpdateOrder {
  payment_method_id?: number
  delivery_method_id?: number
  ordered_at?: string
}

export interface OrderItem {
  product_id: number
  name: string
  brand_name: string
  quantity: number
  unit_price: number
}

export interface CreateOrderItem {
  product_id: number
  quantity: number
}

export interface UpdateOrderItem {
  quantity?: number
}

export interface PaymentMethod {
  id: number
  name: string
}

export interface DeliveryMethod {
  id: number
  name: string
}

export interface Status {
  id: number
  name: string
}

export interface ShippingAddress {
  id: number
  order_id: number
  fname: string
  lname: string
  street: string
  city: string
  zipcode: string
  country: string
}

export interface CreateShippingAddress {
  fname: string
  lname: string
  street: string
  city: string
  zipcode: string
  country: string
}
