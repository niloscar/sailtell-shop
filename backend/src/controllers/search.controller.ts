/**
 * Controller for handling search-related requests.
 */

import { indexAllProducts, search } from '../services/search.service'
import { z } from 'zod'

import type { Request, Response, NextFunction } from 'express'

export async function indexProductsHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    await indexAllProducts()

    res.status(200).json({ message: 'Produkterna har skickats till Algolia för indexering.' })
  } catch (error) {
    next(error)
  }
}

export async function searchProductsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = searchQuerySchema.safeParse(req.query)

    if (!parsed.success) {
      res.status(400).json({
        message: 'Ogiltiga sökparametrar'
      })
      return
    }

    const { q, page, pageSize } = parsed.data

    const result = await search(q, page, pageSize)

    res.json(result)
  } catch (error) {
    next(error)
  }
}

const searchQuerySchema = z.object({
  q: z
    .string()
    .default(''),
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),
  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20)
})
