import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../api/productApi'
import type { Product } from '../types/productTypes'

function ProductList({ category, title }: { category?: string, title?: string | false }) {
  const [products, setProducts] = useState([])
  const [categoryName, setCategoryName] = useState(category || '')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts({ category: category })

        setProducts(response.data.products)
        if (response.data.category) setCategoryName(response.data.category.name)
      } catch (error) {
        console.error('Kunde inte hämta produkter:', error)
      }
    }

    fetchProducts()
  }, [category])

  return (
    <>
      {title !== false && (
        <h1 className="heading-size-1">
          {typeof title === 'string'
            ? title
            : category
              ? <Link to={`/products/${category}`}>{categoryName}</Link>
              : <Link to="/products">All products</Link>
          }
        </h1>
      )}
      <ul className='unstyled product-list'>
        {products.map((product: Product) => (
          <li 
            key={product.id} 
            className='list-item'
          >
            <h2 className="heading-size-2">
              <Link to={`/product/${product.id}`}>
                {product.name}
              </Link>
            </h2>
            {/* <p className='brand-name'>{product.brand_name}</p> */}
            <p>{product.description}</p>
          </li>
        ))}
      </ul>
    </>
  )
}

export default ProductList
