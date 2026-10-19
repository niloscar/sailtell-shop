import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOrders } from '../../api/orderApi'
import formatDateTime, {
  formatDate,
  formatTime,
  timeAgo
} from '../../utilities/formatDateTime'
import formatPrice from '../../utilities/formatPrice'
import getApiErrorMessage from '../../utilities/apiError'
import type { Order } from '../../types/orderTypes'

export default function PageAdminOrders() {
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
        setLoadingError(getApiErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const ordersByStatus = useMemo(() => {
    const groupedOrders: { [status: string]: Order[] } = {}

    const sortedOrders = [...orders].sort((a, b) => {
      const statusDiff =
        (a.order_status?.id ?? Infinity) - (b.order_status?.id ?? Infinity)

      if (statusDiff !== 0) {
        return statusDiff
      }

      return (
        new Date(b.order_status?.set_at ?? 0).getTime() -
        new Date(a.order_status?.set_at ?? 0).getTime()
      )
    })

    sortedOrders.forEach((order) => {
      const status = order.order_status?.name || 'Okänd status'

      if (!groupedOrders[status]) {
        groupedOrders[status] = []
      }

      groupedOrders[status].push(order)
    })

    return groupedOrders
  }, [orders])

  if (loading) return <p>Laddar ordrar...</p>
  if (loadingError) return <p className="errorMessage">{loadingError}</p>
  if (orders.length === 0) return <p>Inga ordrar hittades.</p>

  return (
    <div className="page-orders">
      <table>
        {Object.entries(ordersByStatus).map(([status, orders]) => (
          <tbody key={status}>
            <tr>
              <th colSpan={4}>
                <h3 className="headingSize3">{status}</h3>
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
    </div>
  )
}
