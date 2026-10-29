
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getPaymentConfirmation } from '../../api/paymentApi'
import { useCart } from '../../contexts/CartContext'
import getApiErrorMessage from '../../utilities/apiError'
import Spinner from '../../components/ui/Spinner'
import BackLink from '../../components/BackLink'

import type { PaymentConfirmation } from '../../types/paymentTypes'

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
          await resetCart()
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
          <p>Din betalning har genomförts.</p>
        </>
      ) : order.statusId === 7 ? (
        <>
          <h1 className="headingSize1">Inväntar betalning</h1>
          <p>
            Vi har tagit emot din beställning men betalningen
            har ännu inte bekräftats.
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

      <p>Ordernummer: {order.orderId}</p>

      <h2 className="headingSize2">Din beställning</h2>

      <ul>
        {order.items.map((item) => (
          <li key={item.productId}>
            {item.name} – {item.quantity} st
          </li>
        ))}
      </ul>

      <BackLink to="/" label="Tillbaka till startsidan" />
    </>
  )
}
