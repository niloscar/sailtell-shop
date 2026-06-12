/**
 * This file defines the routes for handling product-related API endpoints.
 */

import { Router } from 'express'

const productsRouter = Router()

/* Mock data for products. */
const brands = [
  { id: 1, name: 'Adidas', description: 'German sportswear manufacturer', url: 'https://www.adidas.com' },
  { id: 2, name: 'The North Face', description: 'American outdoor clothing and gear retailer', url: 'https://www.thenorthface.com' },
  { id: 3, name: 'The North Face', description: 'American outdoor clothing and gear retailer', url: 'https://www.thenorthface.com' }
]

const products = [
  { id: 1, name: 'Adizero Evo SL', brandId: 1, price: 1799 },
  { id: 2, name: 'Altamesa 500 v2', brandId: 2, price: 1499 },
  { id: 3, name: 'Vectiv Summit Pro 3', brandId: 3, price: 2899 }
]

const productsView = products.map(product => {
  const brand = brands.find(brand => brand.id === product.brandId)
  return {
    id: product.id,
    brand: brand ? brand.name : null,
    name: product.name,
    price: product.price
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
    res.status(404).json({ error: 'Product not found' })
  }
})

export default productsRouter