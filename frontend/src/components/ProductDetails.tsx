import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProduct } from '../api/productApi'
import formatPrice from '../utilities/priceFormat'
import type { Product } from '../types/productTypes'

function ProductDetails() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProduct(Number(id))
        setProduct(response.data)
      } catch (error) {
        console.error('Kunde inte hämta produkt:', error)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  if (product !== null) {
    return (
      <div className='product-details'>
        <h2>{product.name}</h2>
        <p className='description'>{product.description}</p>
        <p className='brand-name'>{product.brand}</p>
        <ul className='details'>
          {product.details.map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>
        <p className='price'>{formatPrice(Number(product.price))}</p>
        { renderStock(product.stock) }
      </div>
    )
  } else {
    return <p>Produkten kunde inte hittas.</p>
  }
}

export default ProductDetails

function renderStock(stock: number) {
  if (stock === 0) return <p className="stock alert">Slut i lager</p>
  if (stock <= 3) return <p className="stock warning">Få kvar i lager ({stock} st)</p>
  return <p className="stock success">Finns i lager ({stock} st)</p>
}