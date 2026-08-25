import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getOrders } from '../../api/orderApi'

import formatDateTime, { formatDate, formatTime, timeAgo } from '../../utilities/formatDateTime'
import formatPrice from '../../utilities/formatPrice'

import type { Order } from '../../types/orderTypes'


export default function PageAdminStart() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingError, setLoadingError] = useState<string | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const response = await getOrders()
        setOrders(response.data)
      } catch (error) {
        console.error('Kunde inte hämta ordrar:', error)
        setLoadingError('Kunde inte hämta ordrar.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

const ordersByStatus = useMemo(() => {
  const groupedOrders: { [status: string]: Order[] } = {}

  const activeOrders = orders
    .filter((order) => {
      const status = order.order_status?.name

      return (
        status &&
        status !== 'Levererad' &&
        status !== 'Avbruten'
      )
    })
    .sort((a, b) => {
      const statusDiff =
        (a.order_status?.id ?? Infinity) -
        (b.order_status?.id ?? Infinity)

      if (statusDiff !== 0) return statusDiff

      return (
        new Date(b.order_status?.set_at ?? 0).getTime() -
        new Date(a.order_status?.set_at ?? 0).getTime()
      )
    })

  activeOrders.forEach((order) => {
    const status = order.order_status!.name

    if (!groupedOrders[status]) {
      groupedOrders[status] = []
    }

    groupedOrders[status].push(order)
  })

  return groupedOrders
}, [orders])

if (loading) return <p>Laddar ordrar...</p>
if (loadingError) return <p className="error-message">{loadingError}</p>
if (orders.length === 0) return <p>Inga ordrar hittades.</p>

return (
  <>
    <h1 className="heading-size-1">Adminpanel</h1>

    <section className="statistics-section">
      <h2 className="heading-size-2">Statistik</h2>
      <table>
        <tbody>
          <tr>
            <th>Totalt antal ordrar</th>
            <td>{orders.length}</td>
          </tr>
          <tr>
            <th>Antal aktiva ordrar</th>
            <td>{Object.values(ordersByStatus).reduce((acc, curr) => acc + curr.length, 0)}</td>
          </tr>
          <tr>
            <th>Senaste order</th>
            <td>{orders.length > 0 ? formatDateTime(orders[0].ordered_at) : 'Ingen order'}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section className="orders-section">
      <h2 className="heading-size-2">Aktiva ordrar</h2>

      <table>
        {Object.entries(ordersByStatus).map(([status, orders]) => (
          <tbody key={status}>
            <tr>
              <th colSpan={4}>
                <h3 className="heading-size-3">{status}</h3>
              </th>
            </tr>

            <tr>
              <th>Order.nr</th>
              <th>Orderdatum</th>
              <th>Statusändring</th>
              <th>Summa</th>
            </tr>

            {orders.map((order) => (
              <tr
                key={order.id}
                className="clickable-row"
                onClick={() => navigate(`/admin/order/${order.id}`)}
              >
                <td>{order.id}</td>

                <td title={formatTime(order.ordered_at)}>
                  {formatDate(order.ordered_at)}
                </td>

                <td title={formatDateTime(order.order_status?.set_at)}>
                  {timeAgo(order.order_status?.set_at)}
                </td>

                <td>{formatPrice(Number(order.sum))}</td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </section>
  </>
)
}