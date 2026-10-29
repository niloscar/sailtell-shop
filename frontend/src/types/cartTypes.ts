export interface CartItem {
  id: number
  product_id: number
  name: string
  brand_name: string | null
  img_url: string | null
  quantity: number
  stock: number | null
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
