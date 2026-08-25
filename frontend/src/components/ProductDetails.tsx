import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProduct } from '../api/productApi'
import formatPrice from '../utilities/formatPrice'
import getApiErrorMessage from '../utilities/apiError'
import ToCartButton from './ToCartButton'
import QuantitySelector from './QuantitySelector'
import type { Product } from '../types/productTypes'

function ProductDetails() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingError, setLoadingError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
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

  const stockMessage = product && product.stock && quantity > product.stock
    ? 'Observera att du vill lägga till fler än vad som finns i lager. En del av din beställning kommer att få ett senare leveransdatum.'
    : ''

  if (loading) return <p>Laddar produkt...</p>
  if (loadingError) return <p className="error-message">{loadingError}</p>
  if (product === null) return <p>Produkten kunde inte hittas.</p>

  return (
    <div className='product-page'>

        {product.img_url && (
          <img
            className='product-image'
            src={`${product.img_url}`}
            alt={product.name}
          />
        )}

        <div className='product-details'>

          <h1 className="heading-size-1">{product.name}</h1>
          <p className='brand-name'>{product.brand_name}</p>
          <p className='description'>{product.description}</p>
          
          <ul className='details'>
            {product.details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>

          {product.purchase_type === 'external' ? (

            <section className="external-purchase-section">
              <p>
                Appen finns tillgänglig för nedladdning i AppStore och på Google Play.
              </p>

              <div className="download-badges">
                {product.product_distribution_links.map((link) => (
                  <a
                    key={link.id}
                    href={link.download_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={link.badge_url}
                      className="download-badge"
                      alt={link.distributor} />
                  </a>
                ))}
              </div>
            </section>

          ) : (

            <section className="to-cart-section">
              <div>
                <p className='price'>{formatPrice(Number(product.price))}</p>
                {product.stock && renderStock(product.stock)}
              </div>
              <div className="button-group">
                <QuantitySelector quantity={quantity} onChange={setQuantity} />
                <ToCartButton product={product} quantity={quantity} />
              </div>
              {stockMessage && <p className="stock-message">{stockMessage}</p>}
            </section>

          )}

        </div>
      </div>
    )
}

export default ProductDetails

function renderStock(stock: number) {
  if (stock === 0) return <p className="stock alert">Slut i lager</p>
  if (stock <= 3) return <p className="stock warning">Få kvar i lager ({stock} st)</p>
  return <p className="stock success">Finns i lager ({stock} st)</p>
}