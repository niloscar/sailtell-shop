import api from './apiClient'

import type { Product } from '../types/productTypes'

export function getProducts() {
  return api.get('/products')
}

export function getProduct(id: number) {
  return api.get(`/products/${id}`)
}

export function createProduct(productData: Product) {
  return api.post('/products', productData)
}

export function updateProduct(id: number, productData: Product) {
  return api.patch(`/products/${id}`, productData)
}

export function deleteProduct(id: number) {
  return api.delete(`/products/${id}`)
}