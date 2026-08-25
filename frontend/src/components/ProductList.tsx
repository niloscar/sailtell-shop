import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts } from '../api/productApi'
import type { Product } from '../types/productTypes'

function ProductList({ category }: { category?: string, title?: string | false }) {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts({ category: category })

        setProducts(response.data.products)
      } catch (error) {
        console.error('Kunde inte hämta produkter:', error)
      }
    }

    fetchProducts()
  }, [category])

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
