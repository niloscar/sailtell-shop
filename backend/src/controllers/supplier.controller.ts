/**
 * Controller functions for handling supplier-related API endpoints.
 */

import type { Request, Response } from 'express'
import { z } from 'zod'

import { importSupplierProducts } from '../services/supplier.service'

const importParamsSchema = z.object({
  format: z.enum(['csv', 'xml'])
})

export async function importSupplierProductsHandler(
  req: Request,
  res: Response
) {
  const params = importParamsSchema.safeParse(req.params)

  if (!params.success) {
    res.status(400).json({
      error: 'Ogiltigt importformat. Använd csv eller xml.'
    })
    return
  }

  const result = await importSupplierProducts(params.data.format)

  res.json(result)
}
