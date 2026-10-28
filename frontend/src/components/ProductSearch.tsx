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

  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [searchedQuery, setSearchedQuery] = useState('')

  const handleSearch = async (searchQuery: string, searchPage = 1) => {
    setLoading(true)
    setError(null)

    try {
      const response = await searchProducts(searchQuery, searchPage)

      setProducts(response.data.products)
      setPage(response.data.page)
      setTotal(response.data.total)
      setTotalPages(response.data.totalPages)
      setSearchedQuery(searchQuery)
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
          void handleSearch(query)
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

      {hasSearched &&
        !loading &&
        !error &&
        (products.length === 0 ? (
          <p>Inga produkter hittades.</p>
        ) : (
          <ul className={`unstyled ${listStyles.productList}`}>
            {products.map((product) => (
              <ProductListItem key={product.id} product={product} />
            ))}
          </ul>
        ))}

      {hasSearched && !loading && !error && (
        <>
          <p>{total} produkter hittades.</p>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => void handleSearch(searchedQuery, page - 1)}
              >
                Föregående
              </button>

              <span>
                Sida {page} av {totalPages}
              </span>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => void handleSearch(searchedQuery, page + 1)}
              >
                Nästa
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
