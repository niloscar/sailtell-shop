import { useEffect, useState } from 'react'
import { getProducts } from '../api/productApi'
import ProductListItem from './ProductListItem'
import getApiErrorMessage from '../utilities/apiError'
import Spinner from './ui/Spinner'

import type { Product } from '@shop/shared'

import styles from './ProductList.module.css'

function ProductList({ category, onCategoryLoad }: { category?: string; onCategoryLoad?: (name: string | null) => void }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingError, setLoadingError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts({ category })

        setProducts(response.data.products)
        onCategoryLoad?.(response.data.category?.name ?? null)
      } catch (error) {
        console.error('Kunde inte hämta produkter:', error)
        setLoadingError(getApiErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category, onCategoryLoad])

  if (loading) return <Spinner />
  if (loadingError) return <p className="errorMessage">{loadingError}</p>
  if (products.length === 0) return <p>Inga produkter hittades.</p>

  return (
    <>
      <ul className={`unstyled ${styles.productList}`}>
        {products.map((product: Product) => (
          <ProductListItem key={product.id} product={product} />
        ))}
      </ul>
    </>
  )
}

export default ProductList
