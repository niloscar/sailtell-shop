import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { getProduct } from '../api/productApi'
import formatPrice from '../utilities/formatPrice'
import getApiErrorMessage from '../utilities/apiError'
import ToCartButton from './ToCartButton'
import QuantitySelector from './QuantitySelector'
import Spinner from './ui/Spinner'

import type { Product } from '@shop/shared'

import styles from './ProductDetails.module.css'

function ProductDetails() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingError, setLoadingError] = useState<string | null>(null)

  const { cart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProduct(Number(id))
        setProduct(response.data)
      } catch (error) {
        console.error('Kunde inte hämta produkt:', error)
        setLoadingError(getApiErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  const quantityInCart =
    cart?.items.find((item) => item.product_id === product?.id)?.quantity ?? 0

  const availableStock =
    product?.stock === null || product?.stock === undefined
      ? 0
      : Math.max(0, product.stock - quantityInCart)

  if (loading) return <Spinner />
  if (loadingError) return <p className="errorMessage">{loadingError}</p>
  if (product === null) return <p>Produkten kunde inte hittas.</p>

  return (
    <div className={styles.product}>
      {product.img_url && (
        <img
          className={styles.image}
          src={product.img_url}
          alt={product.name}
        />
      )}

      <div className={styles.content}>
        <h1 className={`headingSize1 ${styles.title}`}>{product.name}</h1>
        {product.brand_name && (
          <p className={styles.brand}>{product.brand_name}</p>
        )}

        {product.description && (
          <p className={styles.description}>{product.description}</p>
        )}

        {product.details && product.details.length > 0 && (
          <ul className={styles.detailList}>
            {product.details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        )}

        {product.purchase_type === 'external' ? (
          <section className={styles.externalPurchase}>
            <p>
              Appen finns tillgänglig för nedladdning i AppStore och på Google
              Play.
            </p>

            <div className={styles.downloadBadges}>
              {product.product_distribution_links.map((link) => (
                <a
                  key={link.id}
                  href={link.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={link.badge_url}
                    className={styles.downloadBadge}
                    alt={link.distributor}
                  />
                </a>
              ))}
            </div>
          </section>
        ) : (
          <section className={styles.purchase}>
            <div>
              <p className={styles.price}>
                {formatPrice(Number(product.price))}
              </p>

              {product.stock !== null && renderStock(product.stock)}
            </div>

            <div className={styles.purchaseControls}>
              <QuantitySelector
                quantity={quantity}
                onChange={setQuantity}
                max={availableStock}
              />

              <ToCartButton product={product} quantity={quantity} />
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default ProductDetails

function renderStock(stock: number) {
  if (stock === 0)
    return <p className={`${styles.stock} ${styles.stockOut}`}>Slut i lager</p>
  if (stock <= 3)
    return (
      <p className={`${styles.stock} ${styles.stockLow}`}>
        Få kvar i lager ({stock} st)
      </p>
    )
  return (
    <p className={`${styles.stock} ${styles.stockAvailable}`}>
      Finns i lager ({stock} st)
    </p>
  )
}
