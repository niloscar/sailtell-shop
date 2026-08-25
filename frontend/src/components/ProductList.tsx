import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts } from '../api/productApi'
import type { Product } from '../types/productTypes'

function ProductList({ category }: { category?: string, title?: string | false }) {
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
        setLoadingError(
          error instanceof Error
            ? error.message
            : 'Kunde inte hämta produkter.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category])

  if (loading) return <p>Laddar produkter...</p>
  if (loadingError) return <p className="error-message">{loadingError}</p>
  if (products.length === 0) return <p>Inga produkter hittades.</p>

  return (
    <>
      <ul className='unstyled product-list'>
        {products.map((product: Product) => (
          <li 
            key={product.id} 
            className='list-item clickable'
            onClick={() => navigate(`/product/${product.id}`)}
          >
            {product.img_url && (
              <img
                className='product-image'
                src={`${product.img_url}`}
                alt={product.name}
              />
            )}
            <div className='product-info'>
              <h2 className="heading-size-2">
                {product.name}
              </h2>
              {/* <p className='brand-name'>{product.brand_name}</p> */}
              <p>{product.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

export default ProductList
