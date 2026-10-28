/**
 * Controller for handling search-related requests.
 */

import type { Request, Response, NextFunction } from 'express'
import { indexAllProducts, search } from '../services/search.service'

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
    const query = String(req.query.q ?? '')
    const page = Number(req.query.page ?? 1)
    const pageSize = Number(req.query.pageSize ?? 20)

    const result = await search(query, page, pageSize)

    res.json(result)
  } catch (error) {
    next(error)
  }
}
