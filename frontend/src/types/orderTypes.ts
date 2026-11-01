export interface Order {
  id: number
  customer_id: number
  payment_method_id: number
  delivery_method_id: number
  ordered_at: string
  sum: number
  order_status: {
    id: number
    name: string
    set_at: string
  }
}

export interface OrderDetails {
  id: number
  customer_id: number
  ordered_at: string
  sum: number
  order_status: {
    id: number
    name: string
    set_at: string
  }
  delivery_method: {
    id: number
    name: string
  }
  payment_method: {
    id: number
    name: string
  }
  shipping_address?: {
    id: number
    order_id: number
    street: string
    city: string
    zipcode: string
    country: string
  }
  order_items: {
    id: number
    product_id: number
    name: string
    brand_name: string
    quantity: number
    unit_price: number
  }[]
}

export interface OrderOptions {
  payment_methods: {
    id: number
    name: string
  }[]
  delivery_methods: {
    id: number
    name: string
  }[]
  statuses: {
    id: number
    name: string
  }[]
}

export interface CreateOrder {
  customer: {
    fname: string
    lname: string
    email: string
    phone?: string
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
  status_id?: number
  payment_method_id?: number
  delivery_method_id?: number
}
