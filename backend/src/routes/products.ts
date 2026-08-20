/**
 * This file defines the routes for handling product-related API endpoints.
 * 
 * Todo:
 * - Skapa endpoints för full CRUD.
 * - Flytta logiken till controllers.
 */

import { Router } from 'express'
import { mockProducts } from '../data/mockdata'

const productsRouter = Router()

/* Mock data for brands and products. */
const products = mockProducts

const productsView = products.map(product => {
  return {
    id: product.id,
    brand: product.brand_name,
    name: product.name,
    description: product.description,
    details: product.details,
    stock: product.stock
  }
})

/* GET /api/products - Get all products */
productsRouter.get('/', (req, res) => {
  res.json(productsView)
})

/* GET /api/products/:id - Get a product by ID */
productsRouter.get('/:id', (req, res) => {
  const productId = parseInt(req.params.id)
  const product = products.find(product => product.id === productId)

  if (product) {
    res.json(product)
  } else {
    res.status(404).json({ error: 'Produkten kunde inte hittas.' })
  }
})

/* POST /api/products - Create a new product */
productsRouter.post('/', (req, res) => {
  const newProduct = req.body
  products.push(newProduct)
  res.status(201).json(newProduct)
})

/* PATCH /api/products/:id - Update a product by ID */
productsRouter.patch('/:id', (req, res) => {
  const productId = parseInt(req.params.id)
  const productIndex = products.findIndex(product => product.id === productId)

  if (productIndex !== -1) {
    const updatedProduct = { ...products[productIndex], ...req.body }
    products[productIndex] = updatedProduct
    res.json(updatedProduct)
  } else {
    res.status(404).json({ error: 'Produkten du vill ändra kunde inte hittas.' })
  }
})

/* DELETE /api/products/:id - Delete a product by ID */
productsRouter.delete('/:id', (req, res) => {
  const productId = parseInt(req.params.id)
  const productIndex = products.findIndex(product => product.id === productId)

  if (productIndex !== -1) {
    products.splice(productIndex, 1)
    res.status(204).send()
  } else {
    res.status(404).json({ error: 'Produkten du vill ta bort kunde inte hittas.' })
  }
})

export default productsRouter