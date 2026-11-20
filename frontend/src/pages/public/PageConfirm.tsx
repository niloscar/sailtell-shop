import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getPaymentConfirmation } from '../../api/paymentApi'
import { useCart } from '../../contexts/CartContext'
import getApiErrorMessage from '../../utilities/apiError'
import Spinner from '../../components/ui/Spinner'
import BackLink from '../../components/BackLink'

import type { PaymentConfirmation } from '../../types/paymentTypes'

import styles from './PageConfirm.module.css'
import formatPrice from '../../utilities/formatPrice'

export default function PageConfirm() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { resetCart } = useCart()

  const [order, setOrder] = useState<PaymentConfirmation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrder() {
      if (!sessionId) {
        setError('Ogiltigt betalnings-ID.')
        setLoading(false)
        return
      }

      try {
        const { data } = await getPaymentConfirmation(sessionId)
        setOrder(data)

        if (data.statusId === 8) {
          try {
            await resetCart()
          } catch (error) {
            console.error(
              'Kunde inte tömma varukorgen efter betalningen.',
              error
            )
          }
        }
      } catch (error) {
        setError(getApiErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [sessionId, resetCart])

  if (loading) return <Spinner />

  if (error) {
    return <p className="errorMessage">{error}</p>
  }

  if (!order) {
    return <p>Beställningen kunde inte hittas.</p>
  }

  return (
    <>
      {order.statusId === 8 ? (
        <>
          <h1 className="headingSize1">Tack för ditt köp!</h1>
          <p>En orderbekräftelse skickas till <strong>{order.email}</strong>.</p>
        </>
      ) : order.statusId === 7 ? (
        <>
          <h1 className="headingSize1">Inväntar betalning</h1>
          <p>
            Vi har tagit emot din beställning men betalningen har ännu inte bekräftats.
          </p>
          <button onClick={() => window.location.reload()}>
            Uppdatera status
          </button>
        </>
      ) : (
        <>
          <h1 className="headingSize1">Orderstatus</h1>
          <p>Din beställning har status: {order.status}.</p>
        </>
      )}

      <h2 className="headingSize2">Din beställning</h2>

      <ul className={styles.orderItemsList}>
        <div className={styles.orderItemsListHeader}>
          <span>Produkt</span>
          <span>Antal</span>
          <span>Styckpris</span>
          <span>Summa</span>
        </div>
        {order.items.map((item) => (
          <li 
            key={item.productId}
            className={styles.orderItem}
          >
            <span className={styles.orderItemName}>{item.name}</span>
            <span className={styles.orderItemQuantity}>{item.quantity} st</span>
            <span className={styles.orderItemUnitPrice}>{formatPrice(item.unitPrice)}/st</span>
            <span className={styles.orderItemTotal}>{formatPrice(item.unitPrice * item.quantity)}</span>
          </li>
        ))}
        <li className={styles.orderItem}>
          <span className={styles.orderItemName}>Frakt</span>
          <span className={styles.orderItemQuantity}></span>
          <span className={styles.orderItemUnitPrice}></span>
          <span className={styles.orderItemTotal}>{formatPrice(order.shippingPrice)}</span>
        </li>
      </ul>

      {order.items.length > 0 && (
        <p className={styles.orderTotal}>
          <strong>Totalt {formatPrice(order.total)}</strong>
        </p>
      )}

      <BackLink to="/" label="Tillbaka till startsidan" />
    </>
  )
}
