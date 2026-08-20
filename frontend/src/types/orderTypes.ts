export interface Order {
  id: number
  customer_id: number
  payment_method_id: number
  delivery_method_id: number
  ordered_at: string
  sum: number
}