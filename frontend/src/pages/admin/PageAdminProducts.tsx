import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts } from '../../api/productApi'
import categoriesToString from '../../utilities/categoriesToString'
import formatPrice from '../../utilities/formatPrice'
import getApiErrorMessage from '../../utilities/apiError'
import { InfinityIcon } from '@phosphor-icons/react'
import type { Product } from '../../types/productTypes'

export default function PageAdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingError, setLoadingError] = useState<string | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await getProducts()
        setProducts(response.data.products)
      } catch (error) {
        setLoadingError(getApiErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) return <p>Laddar produkter...</p>
  if (loadingError) return <p className="errorMessage">{loadingError}</p>
  if (products.length === 0) return <p>Inga produkter hittades.</p>

  return (
    <>
      <h2>Produkter</h2>
      <table>
        <thead>
          <tr>
            <th>Produkt.nr</th>
            <th>Namn</th>
            <th>Kategori</th>
            <th>Pris</th>
            <th>Lagersaldo</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product: Product) => (
            <tr
              key={product.id}
              className="clickable-row"
              onClick={() => navigate(`/admin/product/${product.id}`)}
            >
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{categoriesToString(product.categories)}</td>
              <td>{formatPrice(Number(product.price))}</td>
              <td>
                {product.stock ? `${product.stock} st` : <InfinityIcon />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => navigate('/admin/product/add')} className="add">
        Lägg till produkt
      </button>
    </>
  )
}
