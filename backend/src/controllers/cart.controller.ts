/**
 * Controller functions for handling cart-related API endpoints.
 */

import {
  createCart,
  getCart,
  addCartItem,
  updateCartItem,
  deleteCartItem
} from '../services/cart.service'
import type { Request, Response } from 'express'

type CartParams = {
  cartUuid: string
}

type CartItemParams = {
  cartUuid: string
  productId: string
}

export async function createCartHandler(req: Request, res: Response) {
  const cart = await createCart()
  res.status(201).json(cart)
}

export async function getCartHandler(req: Request<CartParams>, res: Response) {
  const { cartUuid } = req.params
  const cart = await getCart(cartUuid)

  if (!cart) {
    res.status(404).json({ message: 'Varukorgen kunde inte hittas.' })
    return
  }

  res.json(cart)
}

export async function addCartItemHandler(
  req: Request<CartItemParams>,
  res: Response
) {
  const { cartUuid } = req.params
  const { product_id, quantity } = req.body

  if (!product_id || !quantity) {
    res.status(400).json({ message: 'Produkt och antal måste anges.' })
    return
  }

  const cart = await addCartItem(cartUuid, product_id, quantity)

  if (!cart) {
    res.status(404).json({ message: 'Varukorgen kunde inte hittas.' })
    return
  }

  res.status(201).json(cart)
}

export async function updateCartItemHandler(
  req: Request<CartItemParams>,
  res: Response
) {
  const { cartUuid, productId } = req.params
  const { quantity } = req.body

  if (!quantity) {
    res.status(400).json({ message: 'Antal måste anges.' })
    return
  }

  const cart = await updateCartItem(cartUuid, Number(productId), quantity)

  if (!cart) {
    res
      .status(404)
      .json({ message: 'Varukorgen eller produkten kunde inte hittas.' })
    return
  }

  res.json(cart)
}

export async function deleteCartItemHandler(
  req: Request<CartItemParams>,
  res: Response
) {
  const { cartUuid, productId } = req.params
  const cart = await deleteCartItem(cartUuid, Number(productId))

  if (!cart) {
    res
      .status(404)
      .json({ message: 'Varukorgen eller produkten kunde inte hittas.' })
    return
  }

  res.json(cart)
}
