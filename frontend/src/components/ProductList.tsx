import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts } from '../api/productApi'
import getApiErrorMessage from '../utilities/apiError'
import type { Product } from '@shop/shared'

import styles from './ProductList.module.css'

function ProductList({
  category
}: {
  category?: string
  title?: string | false
}) {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingError, setLoadingError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts({ category: category })

        setProducts(response.data.products)
      } catch (error) {
        console.error('Kunde inte hämta produkter:', error)
        setLoadingError(getApiErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category])

  if (loading) return <p>Laddar produkter...</p>
  if (loadingError) return <p className="errorMessage">{loadingError}</p>
  if (products.length === 0) return <p>Inga produkter hittades.</p>

  return (
    <>
      <ul className={`unstyled ${styles.productList}`}>
        {products.map((product: Product) => (
          <li
            key={product.id}
            className={`clickable ${styles.listItem}`}
            onClick={() => navigate(`/product/${product.id}`)}
          >
            {product.img_url && (
              <img
                className={styles.image}
                src={`${product.img_url}`}
                alt={product.name}
              />
            )}
            <div className={styles.info}>
              <h2 className="headingSize2 product-title">{product.name}</h2>
              <p className={styles.description}>{product.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

export default ProductList
