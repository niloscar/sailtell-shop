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
  }
}

export interface OrderDetails {
  id: number
  customer_id: number
  payment_method_id: number
  delivery_method_id: number
  ordered_at: string
  sum: number
  order_status: {
    id: number
    name: string
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