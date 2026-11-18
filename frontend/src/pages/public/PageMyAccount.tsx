import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getMyOrders } from '../../api/orderApi'
import formatPrice from '../../utilities/formatPrice'
import getApiErrorMessage from '../../utilities/apiError'

import type { Order } from '../../types/orderTypes'

import styles from './PageMyAccount.module.css'

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
    <>
      <h1 className="headingSize1">Mitt användarkonto</h1>
      <p>Välkommen, {user?.fname}!</p>
      
      {user?.role === 'admin' && <p>Gå till <a href="/admin">adminpanelen</a>.</p>}

      <h2>Orderhistorik</h2>

      {loading ? (
        <p>Hämtar beställningar...</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : orders.length === 0 ? (
        <p>Du har inga tidigare beställningar.</p>
      ) : (
        <ul className={styles.ordersList}>
          {orders.map((order) => (
            <li 
              key={order.id} 
              className={styles.order}
            >
              <span className={styles.orderDate}>{new Date(order.ordered_at).toLocaleDateString('sv-SE')}</span>
              <span className={styles.orderId}>Order #{order.id}</span>
              <span className={styles.orderSum}>{formatPrice(order.sum)}</span>
              <span className={styles.orderStatus}>{order.order_status.name}</span>
            </li>
          ))}
        </ul>
      )}

      <button className="btn" onClick={() => logout()}>
        Logga ut
      </button>
    </>
  )
}
