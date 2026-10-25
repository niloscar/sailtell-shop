/**
 * Controller functions for handling product-related API endpoints.
 */

import { Request, Response } from 'express'
import {
  getAllProducts,
  getProductsByCategorySlug,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductOptions
} from '../repositories/product.repository'

import { getSupplierProducts } from '../integrations/supplier.adapter'

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

export async function getAllSupplierProductsHandler(req: Request, res: Response) {
  const { products, skippedCount, fetchedAt, fromCache } =
    await getSupplierProducts()

  res.json({ products, skippedCount, fetchedAt, fromCache })
}

export async function getProductsByCategoryHandler(
  req: Request<CategoryParams>,
  res: Response
) {
  const { categorySlug } = req.params

  const products = await getProductsByCategorySlug(categorySlug)

  if (products) {
    res.json(products)
  } else {
    res
      .status(404)
      .json({ error: 'Inga produkter hittades i den angivna kategorin.' })
  }
}

export async function getProductHandler(
  req: Request<ProductParams>,
  res: Response
) {
  const productId = parseInt(req.params.id)
  const product = await getProduct(productId)

  if (product) {
    res.json(product)
  } else {
    res.status(404).json({ error: 'Produkten kunde inte hittas.' })
  }
}

export async function createProductHandler(req: Request, res: Response) {
  const createdProduct = await createProduct(req.body)

  if (createdProduct) {
    res.status(201).json(createdProduct)
  } else {
    res.status(400).json({ error: 'Produkten kunde inte skapas.' })
  }
}

export async function updateProductHandler(
  req: Request<ProductParams>,
  res: Response
) {
  const productId = parseInt(req.params.id)
  const updatedProduct = await updateProduct(productId, req.body)

  if (updatedProduct) {
    res.json(updatedProduct)
  } else {
    res
      .status(404)
      .json({ error: 'Produkten du vill ändra kunde inte hittas.' })
  }
}

export async function deleteProductHandler(
  req: Request<ProductParams>,
  res: Response
) {
  const productId = parseInt(req.params.id)
  await deleteProduct(productId)
  res.status(204).send()
}
