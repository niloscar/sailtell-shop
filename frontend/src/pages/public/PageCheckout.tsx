import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { createOrder, getOrderOptions } from '../../api/orderApi'
import formatPrice from '../../utilities/formatPrice'
import getApiErrorMessage from '../../utilities/apiError'
import Spinner from '../../components/ui/Spinner'

import type { CreateOrder, OrderOptions } from '../../types/orderTypes'

export default function PageCheckout() {
  const { cartCount, cart, resetCart } = useCart()
  const navigate = useNavigate()

  const [orderOptions, setOrderOptions] = useState<OrderOptions>()
  const [orderDetails, setOrderDetails] = useState({
    fname: '',
    lname: '',
    email: '',
    phone: '',
    street: '',
    zipcode: '',
    city: '',
    payment_method: '',
    country: 'Sverige'
  })
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingError, setLoadingError] = useState<string | null>(null)
  const cartItems = cart?.items ?? []

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
  const totalVat = totalPrice * 0.2

  useEffect(() => {
    const fetchOrderOptions = async () => {
      try {
        setLoading(true)
        setLoadingError(null)

        const response = await getOrderOptions()

        setOrderOptions(response.data)
      } catch (error) {
        setLoadingError(getApiErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }

    fetchOrderOptions()
  }, [])

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target

    setOrderDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }))
  }

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    const newOrder: CreateOrder = {
      customer: {
        fname: orderDetails.fname,
        lname: orderDetails.lname,
        email: orderDetails.email,
        phone: orderDetails.phone
      },
      payment_method_id: Number(orderDetails.payment_method),
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
      await createOrder(newOrder)
      await resetCart()

      navigate('/confirmation')
    } catch (error) {
      console.error(getApiErrorMessage(error))
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

  if (loading) return <Spinner />
  if (loadingError) return <p className="errorMessage">{loadingError}</p>
  if (!orderOptions) return <p>Orderalternativ kunde inte laddas.</p>

  return (
    <>
      <h1 className="headingSize1">Kassa</h1>

      <section className="checkout-summary">
        <h2 className="headingSize2">Sammanställning</h2>

        <table>
          <thead>
            <tr>
              <th>Produkt</th>
              <th>Antal</th>
              <th>Pris/st</th>
              <th>Summa</th>
            </tr>
          </thead>

          <tbody className="checkout-items">
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity} st</td>
                <td>{formatPrice(Number(item.price))}</td>
                <td>{formatPrice(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>

          <tfoot className="checkout-totals">
            <tr>
              <td colSpan={3}>Varav moms (25%)</td>
              <td>{formatPrice(totalVat)}</td>
            </tr>
            <tr>
              <th colSpan={3}>Totalt</th>
              <th>{formatPrice(totalPrice)}</th>
            </tr>
          </tfoot>
        </table>
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
                required
                value={orderDetails.payment_method}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Välj betalningsmetod
                </option>
                {orderOptions.payment_methods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>

            {orderDetails.payment_method === '1' && (
              <>
                <div className="inputGroup">
                  <label htmlFor="card_number">Kortnummer</label>
                  <input
                    type="text"
                    id="card_number"
                    name="card_number"
                    required
                  />
                </div>

                <div className="inputGroup">
                  <label htmlFor="card_expiration">Giltighetstid (MM/ÅÅ)</label>
                  <input
                    type="text"
                    id="card_expiration"
                    name="card_expiration"
                    required
                  />
                </div>

                <div className="inputGroup">
                  <label htmlFor="card_cvc">CVC</label>
                  <input type="text" id="card_cvc" name="card_cvc" required />
                </div>
              </>
            )}

            {orderDetails.payment_method === '3' && (
              <div className="inputGroup">
                <label htmlFor="ssn">Personnummer</label>
                <input type="text" id="ssn" name="ssn" required />
              </div>
            )}
          </div>

          <div className="row">
            <p className="terms">
              Genom att slutföra köpet godkänner du våra{' '}
              <Link to="#">villkor</Link>.
            </p>

            <button type="submit" className="checkout-button">
              Slutför köp
            </button>
          </div>
        </form>
      </section>
    </>
  )
}
