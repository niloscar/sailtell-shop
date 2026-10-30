
import { useEffect, useState } from 'react'
import { searchProducts } from '../api/searchApi'
import getApiErrorMessage from '../utilities/apiError'
import ProductListItem from './ProductListItem'
import Ellipsis from './ui/Ellipsis'
import Error from './ui/Error'
import { ArrowLeftIcon, ArrowRightIcon } from '@phosphor-icons/react'


import type { ProductSummary } from '@shop/shared'

import listStyles from './ProductList.module.css'
import styles from './ProductSearch.module.css'

export default function ProductSearch() {
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState<ProductSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query.trim())
    }, 300)

    return () => clearTimeout(timeout)
  }, [query])

  useEffect(() => {
    if (!debouncedQuery) return

    let active = true

    const fetchProducts = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await searchProducts(debouncedQuery, page)

        if (!active) return

        setProducts(response.data.products)
        setTotal(response.data.total)
        setTotalPages(response.data.totalPages)
        setHasSearched(true)
      } catch (error) {
        if (active) setError(getApiErrorMessage(error))
      } finally {
        if (active) setLoading(false)
      }
    }

    void fetchProducts()

    return () => {
      active = false
    }
  }, [debouncedQuery, page])

  return (
    <div className={styles.searchContainer}>
      <input
        name="search"
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setPage(1)
          setHasSearched(false)
          setLoading(false)
          setError(null)
        }}
        placeholder="Börja skriva för att söka..."
        aria-label="Sök produkter"
        className={styles.searchInput}
      />

      {loading && (
        <p>Söker<Ellipsis /></p>
      )}

      {error && <Error message={error} />}

      {hasSearched && !loading && !error && (
        <>
          {products.length === 0 ? (
            <p>Inga produkter hittades.</p>
          ) : (
            <ul className={`unstyled ${listStyles.productList}`}>
              {products.map((product) => (
                <ProductListItem
                  key={product.id}
                  product={product}
                />
              ))}
            </ul>
          )}

          <p className={styles.searchResult}>{total} produkter hittades.</p>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                <ArrowLeftIcon />
                <span>Föregående</span>
              </button>

              <span>
                Sida {page} av {totalPages}
              </span>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                <span>Nästa</span>
                <ArrowRightIcon />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
