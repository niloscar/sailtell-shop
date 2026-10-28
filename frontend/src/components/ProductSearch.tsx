import { useState } from 'react'
import { searchProducts } from '../api/searchApi'
import getApiErrorMessage from '../utilities/apiError'
import ProductListItem from './ProductListItem'

import type { ProductSummary } from '@shop/shared'

import listStyles from './ProductList.module.css'
import styles from './ProductSearch.module.css'

export default function ProductSearch() {
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState<ProductSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await searchProducts(query)

      setProducts(response.data.products)
      setHasSearched(true)
    } catch (error) {
      setError(getApiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.searchContainer}>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          void handleSearch()
        }}
      >
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Sök produkter..."
          aria-label="Sök produkter"
          className={styles.searchInput}
        />
        <button
          type="submit"
          disabled={loading}
          className={styles.searchButton}
        >
          {loading ? 'Söker...' : 'Sök'}
        </button>
      </form>

      {error && <p className="errorMessage">{error}</p>}

      {hasSearched && !loading && !error && (
        products.length === 0 ? (
          <p>Inga produkter hittades.</p>
        ) : (
          <ul className={`unstyled ${listStyles.productList}`}>
            {products.map((product) => (
              <ProductListItem key={product.id} product={product} />
            ))}
          </ul>
        )
      )}
    </div>
  )
}
