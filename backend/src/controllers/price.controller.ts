/**
 * Controller functions for handling price-related API endpoints.
 */

import { Request, Response } from 'express'
import {
  getPrice,
  getPriceHistory,
  createPrice
} from '../services/price.service'

type ProductParams = {
  productId: string
}

export async function getPriceHistoryHandler(
  req: Request<ProductParams>,
  res: Response
) {
  const productId = parseInt(req.params.productId)
  const prices = await getPriceHistory(productId)

  if (prices) {
    res.json(prices)
  } else {
    res
      .status(404)
      .json({ error: 'Inga prisuppgifter hittades för den angivna produkten.' })
  }
}

export async function getPriceHandler(
  req: Request<ProductParams>,
  res: Response
) {
  const priceId = parseInt(req.params.productId)
  const price = await getPrice(priceId)

  if (price) {
    res.json(price)
  } else {
    res.status(404).json({ error: 'Priset kunde inte hittas.' })
  }
}

export async function createPriceHandler(
  req: Request<ProductParams>,
  res: Response
) {
  const productId = parseInt(req.params.productId)
  const { price } = req.body

  const newPrice = await createPrice(productId, price)

  if (newPrice) {
    res.status(201).json(newPrice)
  } else {
    res.status(400).json({ error: 'Priset kunde inte skapas.' })
  }
}
