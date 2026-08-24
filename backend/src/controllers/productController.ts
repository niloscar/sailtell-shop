/**
 * Controller functions for handling product-related API endpoints.
 */

import { Request, Response } from 'express'
import { getAllProducts, getProductsByCategorySlug, getProduct, createProduct, updateProduct, deleteProduct } from '../services/productService'

type ProductParams = {
  id: string
}

type CategoryParams = {
  categorySlug: string
}

export async function getAllProductsHandler(req: Request, res: Response) {
  const { products, category: categoryData } = await getAllProducts()
  res.json({ products, category: categoryData })
}

export async function getProductsByCategoryHandler(
  req: Request<CategoryParams>,
  res: Response
) {
  const { categorySlug } = req.params

  const products = await getProductsByCategorySlug(categorySlug)

  res.json(products)
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
  const product = req.body
  const createdProduct = await createProduct(product.name, product.description, product.details, product.stock)
  res.status(201).json(createdProduct)
}

export async function updateProductHandler(req: Request<ProductParams>, res: Response) {
  const productId = parseInt(req.params.id)
  const updates = req.body

  const updatedProduct = await updateProduct(productId, updates)

  if (updatedProduct) {
    res.json(updatedProduct)
  } else {
    res.status(404).json({ error: 'Produkten du vill ändra kunde inte hittas.' })
  }
}

export async function deleteProductHandler(req: Request<ProductParams>, res: Response) {
  const productId = parseInt(req.params.id)
  await deleteProduct(productId)
  res.status(204).send()
}