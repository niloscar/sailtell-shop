import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getMyOrders } from '../../api/orderApi'
import formatPrice from '../../utilities/formatPrice'
import getApiErrorMessage from '../../utilities/apiError'

import type { Order } from '../../types/orderTypes'

export default function PageMyAccount() {
  const { user, logout } = useAuth()

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    getMyOrders()
      .then(({ data }) => {
        if (active) setOrders(data)
      })
      .catch((error) => {
        if (active) setError(getApiErrorMessage(error))
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <div>
      <h1 className="headingSize1">Mitt användarkonto</h1>
      <p>Välkommen, {user?.fname}!</p>

      <h2>Orderhistorik</h2>

      {loading ? (
        <p>Hämtar beställningar...</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : orders.length === 0 ? (
        <p>Du har inga tidigare beställningar.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              Order #{order.id} –{' '}
              {new Date(order.ordered_at).toLocaleDateString('sv-SE')} –{' '}
              {formatPrice(order.sum)} –{' '}
              {order.order_status.name}
            </li>
          ))}
        </ul>
      )}

      <button className="btn" onClick={() => logout()}>
        Logga ut
      </button>
    </div>
  )
}
