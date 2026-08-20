/**
 * Controller functions for handling product-related API endpoints.
 */

import { Request, Response } from 'express'
import { mockProducts as products } from '../data/mockdata'

type ProductParams = {
  id: string
}

export async function getProducts(req: Request, res: Response) {
  res.json(products)
}

export async function getProduct(req: Request<ProductParams>, res: Response) {
  const productId = parseInt(req.params.id)
  const product = products.find(product => product.id === productId)

  if (product) {
    res.json(product)
  } else {
    res.status(404).json({ error: 'Produkten kunde inte hittas.' })
  }
}

export async function createProduct(req: Request, res: Response) {
  const newProduct = req.body
  products.push(newProduct)
  res.status(201).json(newProduct)
}

export async function updateProduct(req: Request<ProductParams>, res: Response) {
  const productId = parseInt(req.params.id)
  const productIndex = products.findIndex(product => product.id === productId)

  if (productIndex !== -1) {
    const updatedProduct = { ...products[productIndex], ...req.body }
    products[productIndex] = updatedProduct
    res.json(updatedProduct)
  } else {
    res.status(404).json({ error: 'Produkten du vill ändra kunde inte hittas.' })
  }
}

export async function deleteProduct(req: Request<ProductParams>, res: Response) {
  const productId = parseInt(req.params.id)
  const productIndex = products.findIndex(product => product.id === productId)

  if (productIndex !== -1) {
    products.splice(productIndex, 1)
    res.status(204).send()
  } else {
    res.status(404).json({ error: 'Produkten du vill ta bort kunde inte hittas.' })
  }
}