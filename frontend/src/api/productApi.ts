import api from './apiClient'
import type { CreateProduct, UpdateProduct } from '../types/productTypes'

export function getProductOptions() {
  return api.get('/products/options')
}

export function getProducts({ category }: { category?: string } = {}) {
  const url = category ? `/products/category/${category}` : '/products'
  return api.get(url)
}

export function getProduct(id: number) {
  return api.get(`/products/${id}`)
}

export function createProduct(product: CreateProduct) {
  return api.post('/products', product)
}

export function updateProduct(id: number, product: UpdateProduct) {
  return api.patch(`/products/${id}`, product)
}

export function deleteProduct(id: number) {
  return api.delete(`/products/${id}`)
}