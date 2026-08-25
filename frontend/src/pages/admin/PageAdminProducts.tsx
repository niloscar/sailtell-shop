import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getProducts } from '../../api/productApi'
import type { Product } from '../../types/productTypes'
import categoriesToString from '../../utilities/categoriesToString'
import formatPrice from '../../utilities/formatPrice'
import { InfinityIcon } from '@phosphor-icons/react'

 export default function PageAdminProducts() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts()
        setProducts(response.data.products)
      } catch (error) {
        console.error('Kunde inte hämta produkter:', error)
      }
    }

    fetchProducts()
  }, [])

  console.log(products) // Debugging line to check the fetched products

  return (
    <>
      <h2>Produkter</h2>
      <Link to="/admin/product/add" className="add-product">
        Lägg till produkt
      </Link>
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
              <td>{product.stock ? `${product.stock} st` : <InfinityIcon />}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}