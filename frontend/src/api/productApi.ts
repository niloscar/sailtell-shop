import api from './apiClient'
import type { Product, CreateProduct, UpdateProduct } from '@shop/shared'

interface ProductMutationResponse {
  product: Product
  searchIndexUpdated: boolean
}

interface DeleteProductResponse {
  searchIndexUpdated: boolean
}

export function getProductOptions() {
  return api.get('/products/options')
}

export function getProducts({ category }: { category?: string } = {}) {
  const url = category ? `/products/category/${category}` : '/products'
  return api.get(url)
}

export function getProduct(id: number) {
  return api.get<Product>(`/products/${id}`)
}

export function createProduct(product: CreateProduct) {
  return api.post<ProductMutationResponse>('/products', product)
}

export function updateProduct(id: number, product: UpdateProduct) {
  return api.patch<ProductMutationResponse>(`/products/${id}`, product)
}

export function deleteProduct(id: number) {
  return api.delete<DeleteProductResponse>(`/products/${id}`)
}
