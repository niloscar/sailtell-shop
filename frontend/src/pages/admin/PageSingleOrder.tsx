import { getOrder } from '../../api/orderApi'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { Order } from '../../types/orderTypes'

function PageSingleOrder() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrder(Number(id))
        setOrder(response.data)
      } catch (error) {
        console.error('Kunde inte hämta order:', error)
      }
    }

    fetchOrder()
  }, [id])

  return (
    <div>
      <h1>Order {order?.id}</h1>
      <p>Kund ID: {order?.customer_id}</p>
      <p>Summa: {order?.sum}</p>
      <p>Orderdatum: {order?.ordered_at}</p>
      <Link to="/admin">Tillbaka till orderlistan</Link>
    </div>
  )
}

export default PageSingleOrder