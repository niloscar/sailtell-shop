export interface CartItem {
  id: number
  product_id: number
  name: string
  brand_name: string
  img_url: string
  quantity: number
  price: number
}

export interface Cart {
  id: number
  cart_uuid: string
  created_at: string
  updated_at: string
  items: CartItem[]
}

export interface AddCartItem {
  product_id: number
  quantity: number
}

export interface UpdateCartItem {
  quantity: number
}