import api from './apiClient'

import type { Cart, AddCartItem, UpdateCartItem } from '../types/cartTypes'

export function createCart() {
  return api.post<Cart>('/carts')
}

export function getCart(cartUuid: string) {
  return api.get<Cart>(`/carts/${cartUuid}`)
}

export function addCartItem(cartUuid: string, item: AddCartItem) {
  return api.post<Cart>(`/carts/${cartUuid}/items`, item)
}

export function updateCartItem(
  cartUuid: string,
  productId: number,
  item: UpdateCartItem
) {
  return api.patch<Cart>(`/carts/${cartUuid}/items/${productId}`, item)
}

export function deleteCartItem(cartUuid: string, productId: number) {
  return api.delete<Cart>(`/carts/${cartUuid}/items/${productId}`)
}
