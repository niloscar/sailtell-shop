
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { createPayment } from '../../api/paymentApi'
import formatPrice from '../../utilities/formatPrice'
import getApiErrorMessage from '../../utilities/apiError'
import Error from '../../components/ui/Error'

import type { CreateOrder } from '../../types/orderTypes'

import styles from './PageCheckout.module.css'

export default function PageCheckout() {
  const { cartCount, cart } = useCart()

  const [orderDetails, setOrderDetails] = useState({
    fname: '',
    lname: '',
    email: '',
    phone: '',
    street: '',
    zipcode: '',
    city: '',
    country: 'Sverige'
  })

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const cartItems = cart?.items ?? []

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
  const totalVat = totalPrice * 0.2

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target

    setOrderDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }))
  }

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (submitting) return

    const newOrder: CreateOrder = {
      customer: {
        fname: orderDetails.fname,
        lname: orderDetails.lname,
        email: orderDetails.email,
        phone: orderDetails.phone
      },
      payment_method_id: 1,
      delivery_method_id: 1,
      shipping_address: {
        fname: orderDetails.fname,
        lname: orderDetails.lname,
        street: orderDetails.street,
        zipcode: orderDetails.zipcode,
        city: orderDetails.city,
        country: orderDetails.country
      },
      order_items: cartItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity
      }))
    }

    try {
      setSubmitting(true)
      setSubmitError(null)

      const { data } = await createPayment(newOrder)

      window.location.assign(data.url)
    } catch (error) {
      setSubmitError(getApiErrorMessage(error))
      setSubmitting(false)
    }
  }

  if (cartCount === 0) {
    return (
      <>
        <h1 className="headingSize1">Kassa</h1>
        <p>Din varukorg är tom.</p>
      </>
    )
  }

  return (
    <>
      <h1 className="headingSize1">Kassa</h1>

      <section className="checkout-summary">
        <h2 className="headingSize2">Sammanställning</h2>

        <div className={styles.checkoutGrid}>
          <div className={styles.checkoutHeader}>
            <span>Produkt</span>
            <span>Antal</span>
            <span>Pris/st</span>
            <span>Summa</span>
          </div>

          <ul className={styles.checkoutList}>
            {cartItems.map((item) => (
              <li key={item.id} className={styles.checkoutItem}>
                <Link to={`/product/${item.product_id}`}>
                  {item.name}
                </Link>

                <span>{item.quantity} st</span>
                <span>{formatPrice(Number(item.price))}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.checkoutTotals}>
          <div>
            <span>Varav moms (25%)</span>
            <span>{formatPrice(totalVat)}</span>
          </div>

          <div>
            <strong>Totalt</strong>
            <strong>{formatPrice(totalPrice)}</strong>
          </div>
        </div>
      </section>

      <section className="customer-credentials">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="formGroup">
            <h2 className="headingSize3">Kunduppgifter</h2>
            <div className="inputGroup">
              <label htmlFor="email">E-post</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={orderDetails.email}
                onChange={handleChange}
              />
            </div>

            <div className="inputGroup">
              <label htmlFor="fname">Förnamn</label>
              <input
                type="text"
                id="fname"
                name="fname"
                required
                value={orderDetails.fname}
                onChange={handleChange}
              />
            </div>

            <div className="inputGroup">
              <label htmlFor="lname">Efternamn</label>
              <input
                type="text"
                id="lname"
                name="lname"
                required
                value={orderDetails.lname}
                onChange={handleChange}
              />
            </div>

            <div className="inputGroup">
              <label htmlFor="phone">Mobiltelefon</label>
              <input
                type="text"
                id="phone"
                name="phone"
                required
                value={orderDetails.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="formGroup">
            <h3 className="headingSize3">Leveransadress</h3>
            <div className="inputGroup">
              <label htmlFor="street">Gatuadress</label>
              <input
                type="text"
                id="street"
                name="street"
                required
                value={orderDetails.street}
                onChange={handleChange}
              />
            </div>

            <div className="inputGroup">
              <label htmlFor="zipcode">Postnummer</label>
              <input
                type="text"
                id="zipcode"
                name="zipcode"
                required
                value={orderDetails.zipcode}
                onChange={handleChange}
              />
            </div>

            <div className="inputGroup">
              <label htmlFor="city">Stad</label>
              <input
                type="text"
                id="city"
                name="city"
                required
                value={orderDetails.city}
                onChange={handleChange}
              />
            </div>

            <div className="inputGroup">
              <label htmlFor="country">Land</label>
              <input
                type="text"
                id="country"
                name="country"
                value={orderDetails.country}
                readOnly
                required
              />
            </div>
          </div>

          <div className="formGroup">
            <h3 className="headingSize3">Betalning</h3>

            <div className="inputGroup">
              <label htmlFor="payment_method">Betalningsmetod</label>
              <select
                id="payment_method"
                name="payment_method"
                value="1"
                disabled
              >
                <option value="1">Kort</option>
              </select>
              <p className="form-note">
                Endast kortbetalning via Stripe är tillgänglig just nu.
              </p>
            </div>
          </div>

          {submitError && (
            <Error message={submitError} />
          )}

          <div className="row">
            <p className="terms">
              Genom att slutföra köpet godkänner du våra{' '}
              <Link to="#">villkor</Link>.
            </p>

            <button
              type="submit"
              className="checkout"
              disabled={submitting}
            >
              {submitting ? 'Förbereder betalning...' : 'Gå till betalning'}
            </button>
          </div>
        </form>
      </section>
    </>
  )
}
