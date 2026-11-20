import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getMyOrders } from '../../api/orderApi'
import formatPrice from '../../utilities/formatPrice'
import getApiErrorMessage from '../../utilities/apiError'

import type { Order } from '../../types/orderTypes'

import styles from './PageMyAccount.module.css'
import { ArrowRightIcon, XIcon } from '@phosphor-icons/react'

export default function PageMyAccount() {
  const { user, logout } = useAuth()

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

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
      
      {user?.role === 'admin' && (
        <button 
          className={`btn ${styles.adminPanelButton}`} 
          onClick={() => navigate('/admin')}
        >
          <span>Adminpanelen</span>
          <ArrowRightIcon />
        </button>
      )}

      <h2>Orderhistorik</h2>

      {loading ? (
        <p>Hämtar beställningar...</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : orders.length === 0 ? (
        <p>Du har inga tidigare beställningar.</p>
      ) : (
        <ul className={styles.ordersList}>
          <li className={styles.ordersListHeader}>
            <span className={styles.orderDate}>Datum</span>
            <span className={styles.orderId}>Ordernummer</span>
            <span className={styles.orderSum}>Summa</span>
            <span className={styles.orderStatus}>Status</span>
          </li>
          {orders.map((order) => (
            <li 
              key={order.id} 
              className={styles.order}
            >
              <span className={styles.orderDate}>{new Date(order.ordered_at).toLocaleDateString('sv-SE')}</span>
              <span className={styles.orderId}>#{order.id}</span>
              <span className={styles.orderSum}>{formatPrice(order.sum)}</span>
              <span className={styles.orderStatus}>{order.order_status.name}</span>
            </li>
          ))}
        </ul>
      )}

      <button 
        className={`btn ${styles.logoutButton}`}
        onClick={() => logout()}
      >
        <XIcon />
        <span>Logga ut</span>
      </button>
    </>
  )
}
