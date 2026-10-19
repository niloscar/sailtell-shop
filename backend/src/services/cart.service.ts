import * as cartRepository from '../repositories/cart.repository'

export async function createCart() {
  return cartRepository.createCart()
}

export async function getCart(cartUuid: string) {
  const cart = await cartRepository.findCartByUuid(cartUuid)

  if (!cart) {
    return null
  }

  const items = await cartRepository.getCartItems(cart.id)

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
  const cartId = await cartRepository.findCartIdByUuid(cartUuid)

  if (!cartId) {
    return null
  }

  await cartRepository.upsertCartItem(cartId, productId, quantity)
  await cartRepository.touchCartById(cartId)

  return getCart(cartUuid)
}

export async function updateCartItem(
  cartUuid: string,
  productId: number,
  quantity: number
) {
  const updated = await cartRepository.updateCartItemQuantity(
    cartUuid,
    productId,
    quantity
  )

  if (!updated) {
    return null
  }

  await cartRepository.touchCartByUuid(cartUuid)

  return getCart(cartUuid)
}

export async function deleteCartItem(cartUuid: string, productId: number) {
  const deleted = await cartRepository.deleteCartItem(cartUuid, productId)

  if (!deleted) {
    return null
  }

  await cartRepository.touchCartByUuid(cartUuid)

  return getCart(cartUuid)
}
