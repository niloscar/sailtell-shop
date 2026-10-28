/**
 * Controller functions for handling product-related API endpoints.
 */

import { Request, Response } from 'express'
import {
  getAllProducts,
  getProductsByCategorySlug,
  getProduct,
  getProductOptions
} from '../repositories/product.repository'
import {
  createProduct,
  updateProduct,
  deleteProduct
} from '../services/product.service'

type ProductParams = {
  id: string
}

type CategoryParams = {
  categorySlug: string
}

export async function getProductOptionsHandler(req: Request, res: Response) {
  const productOptions = await getProductOptions()
  res.json(productOptions)
}

export async function getAllProductsHandler(req: Request, res: Response) {
  const { products, category: categoryData } = await getAllProducts()
  res.json({ products, category: categoryData })
}

export async function getProductsByCategoryHandler(req: Request<CategoryParams>, res: Response) {
  const { categorySlug } = req.params

  const products = await getProductsByCategorySlug(categorySlug)

  if (products) {
    res.json(products)
  } else {
    res.status(404).json({ error: 'Inga produkter hittades i den angivna kategorin.' })
  }
}

export async function getProductHandler(req: Request<ProductParams>, res: Response) {
  const productId = parseInt(req.params.id)
  const product = await getProduct(productId)

  if (product) {
    res.json(product)
  } else {
    res.status(404).json({ error: 'Produkten kunde inte hittas.' })
  }
}

export async function createProductHandler(req: Request, res: Response) {
  const result = await createProduct(req.body)

  res.status(201).json(result)
}

export async function updateProductHandler(req: Request<ProductParams>, res: Response) {
  const productId = parseInt(req.params.id)
  const result = await updateProduct(productId, req.body)

  res.json(result)
}

export async function deleteProductHandler(req: Request<ProductParams>, res: Response) {
  const productId = parseInt(req.params.id)
  const result = await deleteProduct(productId)

  res.json(result)
}
