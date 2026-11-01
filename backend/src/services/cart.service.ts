import * as repository from '../repositories/cart.repository'
import type { Cart } from '@shop/shared'

export async function createCart() {
  return repository.createCart()
}

export async function getCart(cartUuid: string): Promise<Cart | null> {
  const cart = await repository.findCartByUuid(cartUuid)

  if (!cart) {
    return null
  }

  const items = await repository.getCartItems(cart.id)

  return {
    ...cart,
    items
  }
}

export async function addCartItem(
  cartUuid: string,
  productId: number,
  quantity: number
) {
  const cartId = await repository.findCartIdByUuid(cartUuid)

  if (!cartId) {
    return null
  }

  await repository.upsertCartItem(cartId, productId, quantity)
  await repository.touchCartById(cartId)

  return getCart(cartUuid)
}

export async function updateCartItem(
  cartUuid: string,
  productId: number,
  quantity: number
) {
  const updated = await repository.updateCartItemQuantity(
    cartUuid,
    productId,
    quantity
  )

  if (!updated) {
    return null
  }

  await repository.touchCartByUuid(cartUuid)

  return getCart(cartUuid)
}

export async function deleteCartItem(cartUuid: string, productId: number) {
  const deleted = await repository.deleteCartItem(cartUuid, productId)

  if (!deleted) {
    return null
  }

  await repository.touchCartByUuid(cartUuid)

  return getCart(cartUuid)
}
