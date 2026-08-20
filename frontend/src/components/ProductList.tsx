import { useEffect, useState } from 'react'
import { getProducts } from '../api/productApi'
import type { Product } from '../types/productTypes'

function ProductList() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts()
        setProducts(response.data)
      } catch (error) {
        console.error('Kunde inte hämta produkter:', error)
      }
    }

    fetchProducts()
  }, [])

  return (
    <>
      <h2>Produkter</h2>
      <ul className='unstyled product-list'>
        {products.map((product: Product) => (
          <li 
            key={product.id} 
            className='list-item'
          >
            <h3>
              <a href={`/product/${product.id}`}>
                {product.name}
              </a>
            </h3>
            <p className='brand-name'>{product.brand}</p>
            <p>{product.description}</p>
          </li>
        ))}
      </ul>
    </>
  )
}

export default ProductList
