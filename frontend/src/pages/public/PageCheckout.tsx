import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { createPayment } from '../../api/paymentApi'
import {
  getServicePoints,
  getShippingPrices,
  getDeliveryEstimates,
  type DeliveryEstimate,
  type ServicePoint,
  type ShippingPrices
} from '../../api/shippingApi'
import formatPrice from '../../utilities/formatPrice'
import getApiErrorMessage from '../../utilities/apiError'
import Error from '../../components/ui/Error'
import Spinner from '../../components/ui/Spinner'
import Ellipsis from '../../components/ui/Ellipsis'

import type { CreateOrder } from '../../types/orderTypes'

import styles from './PageCheckout.module.css'

function formatEstimatedDeliveryTime(
  estimate: DeliveryEstimate
): string | null {
  const parseDate = (value: string): number | null => {
    const match = /^(\d{4})-(\d{2})-(\d{2})T/.exec(value)

    if (!match) return null

    const year = Number(match[1])
    const month = Number(match[2])
    const day = Number(match[3])
    const date = new Date(Date.UTC(year, month - 1, day))

    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      return null
    }

    return date.getTime()
  }

  const arrival = estimate.estimatedTimeOfArrival
  const range = arrival?.dayRangeOfArrival

  if (
    range &&
    Number.isInteger(range.daysMinimum) &&
    Number.isInteger(range.daysMaximum) &&
    range.daysMinimum >= 0 &&
    range.daysMaximum >= range.daysMinimum
  ) {
    return range.daysMinimum === range.daysMaximum
      ? `${range.daysMinimum} dagar`
      : `${range.daysMinimum}–${range.daysMaximum} dagar`
  }

  if (!arrival?.timeOfArrival) return null

  const startDate = parseDate(estimate.startTime)
  const arrivalDate = parseDate(arrival.timeOfArrival)

  if (startDate === null || arrivalDate === null) return null

  const days = (arrivalDate - startDate) / (24 * 60 * 60 * 1000)

  return Number.isInteger(days) && days >= 0 ? `${days} dagar` : null
}

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
  const [deliveryMethodId, setDeliveryMethodId] = useState(1)
  const [servicePoints, setServicePoints] = useState<ServicePoint[]>([])
  const [servicePointId, setServicePointId] = useState('')
  const [servicePointsLoading, setServicePointsLoading] = useState(false)
  const [servicePointsError, setServicePointsError] = useState<string | null>(
    null
  )
  const [shippingPrices, setShippingPrices] = useState<ShippingPrices | null>(
    null
  )
  const [shippingPricesError, setShippingPricesError] = useState<string | null>(
    null
  )
  const [deliveryEstimates, setDeliveryEstimates] = useState<
    DeliveryEstimate[]
  >([])
  const [deliveryEstimatesError, setDeliveryEstimatesError] = useState<
    string | null
  >(null)

  const cartItems = cart?.items ?? []
  const postalCode = orderDetails.zipcode.replace(/\s/g, '')
  const selectedShippingPrice =
    shippingPrices === null
      ? null
      : deliveryMethodId === 1
        ? shippingPrices.pickup
        : shippingPrices.home

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
  const totalWithShipping =
    selectedShippingPrice === null ? null : totalPrice + selectedShippingPrice
  const totalVat =
    totalWithShipping === null ? null : Math.round(totalWithShipping / 5)
  const selectedDeliveryEstimate = deliveryEstimates.find(
    (estimate) => estimate.deliveryMethodId === deliveryMethodId
  )
  const estimatedDeliveryTime = selectedDeliveryEstimate
    ? formatEstimatedDeliveryTime(selectedDeliveryEstimate)
    : null

  useEffect(() => {
    if (!cart) return

    const fetchShippingPrices = async () => {
      try {
        setShippingPricesError(null)
        const response = await getShippingPrices(cart.cart_uuid)
        setShippingPrices(response.data)
      } catch (error) {
        setShippingPrices(null)
        setShippingPricesError(getApiErrorMessage(error))
      }
    }

    fetchShippingPrices()
  }, [cart])

  useEffect(() => {
    if (deliveryMethodId !== 1 || !/^\d{5}$/.test(postalCode)) return

    let active = true

    const fetchServicePoints = async () => {
      try {
        const response = await getServicePoints(postalCode)
        if (active) {
          setServicePoints(response.data)
        }
      } catch (error) {
        if (active) {
          setServicePointsError(getApiErrorMessage(error))
        }
      } finally {
        if (active) {
          setServicePointsLoading(false)
        }
      }
    }

    fetchServicePoints()

    return () => {
      active = false
    }
  }, [deliveryMethodId, postalCode])

  useEffect(() => {
    if (!/^\d{5}$/.test(postalCode)) return

    let active = true

    const fetchDeliveryEstimates = async () => {
      try {
        const response = await getDeliveryEstimates(postalCode)
        if (active) {
          setDeliveryEstimates(response.data)
        }
      } catch (error) {
        if (active) {
          setDeliveryEstimatesError(getApiErrorMessage(error))
        }
      }
    }

    fetchDeliveryEstimates()

    return () => {
      active = false
    }
  }, [postalCode])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    if (name === 'zipcode') {
      const normalizedPostalCode = value.replace(/\s/g, '')

      setServicePointId('')
      setServicePoints([])
      setServicePointsError(null)
      setServicePointsLoading(
        deliveryMethodId === 1 && /^\d{5}$/.test(normalizedPostalCode)
      )
      setDeliveryEstimates([])
      setDeliveryEstimatesError(null)
    }

    setOrderDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }))
  }

  const handleDeliveryMethodChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const nextDeliveryMethodId = Number(event.target.value)

    setDeliveryMethodId(nextDeliveryMethodId)
    setServicePointId('')
    setServicePoints([])
    setServicePointsError(null)
    setServicePointsLoading(
      nextDeliveryMethodId === 1 && /^\d{5}$/.test(postalCode)
    )
    setSubmitError(null)
  }

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (submitting) return
    if (deliveryMethodId === 1 && !servicePointId) {
      setSubmitError('Välj ett PostNord-ombud innan du går vidare.')
      return
    }

    const newOrder: CreateOrder = {
      customer: {
        fname: orderDetails.fname,
        lname: orderDetails.lname,
        email: orderDetails.email,
        phone: orderDetails.phone
      },
      payment_method_id: 1,
      delivery_method_id: deliveryMethodId,
      ...(deliveryMethodId === 1 && { servicePointId }),
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

      <div className={styles.checkoutLayout}>
        <section className={`${styles.checkoutSummary} checkout-summary`}>
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
                  <Link to={`/product/${item.product_id}`}>{item.name}</Link>

                  <span>{item.quantity} st</span>
                  <span>{formatPrice(Number(item.price))}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
              <li className={styles.checkoutItem}>
                <span>
                  Frakt –{' '}
                  {deliveryMethodId === 1
                    ? 'PostNord ombud'
                    : 'PostNord hemleverans'}
                </span>
                <span>1 st </span>
                <span>–</span>
                <span>
                  {selectedShippingPrice === null
                    ? 'Fraktpris saknas'
                    : formatPrice(selectedShippingPrice)}
                </span>
              </li>
            </ul>
            <div className={styles.checkoutTotals}>
              <div>
                <span>Varor</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              <div>
                <span>Frakt</span>
                <span>
                  {selectedShippingPrice === null
                    ? 'Fraktpris saknas'
                    : selectedShippingPrice === 0
                      ? 'Fri frakt'
                      : formatPrice(selectedShippingPrice)}
                </span>
              </div>

              <div>
                <span>Varav moms (25%)</span>
                <span>
                  {totalVat === null
                    ? 'Fraktpris saknas'
                    : formatPrice(totalVat)}
                </span>
              </div>

              <div className={styles.checkoutTotal}>
                <strong>Totalt</strong>
                <strong>
                  {totalWithShipping === null
                    ? 'Fraktpris saknas'
                    : formatPrice(totalWithShipping)}
                </strong>
              </div>
            </div>
          </div>
        </section>

        <section
          className={`${styles.checkoutCredentials} customer-credentials`}
        >
          <form
            className={`${styles.checkoutForm} checkout-form`}
            onSubmit={handleSubmit}
          >
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
              <h3 className="headingSize3">Leverans</h3>

              <div className="inputGroup">
                <label htmlFor="delivery-method">Leveransmetod</label>
                <select
                  id="delivery-method"
                  value={deliveryMethodId}
                  onChange={handleDeliveryMethodChange}
                >
                  <option value="1">PostNord ombud</option>
                  <option value="3">PostNord hemleverans</option>
                </select>
              </div>

              {shippingPricesError && <Error message={shippingPricesError} />}
              {deliveryEstimatesError && (
                <Error message={deliveryEstimatesError} />
              )}

              {deliveryMethodId === 1 && (
                <div className="inputGroup">
                  <label htmlFor="service-point">PostNord-ombud</label>
                  {servicePointsLoading ? (
                    <Spinner />
                  ) : (
                    <select
                      id="service-point"
                      value={servicePointId}
                      onChange={(event) =>
                        setServicePointId(event.target.value)
                      }
                      disabled={servicePoints.length === 0}
                    >
                      <option value="">Välj ombud</option>
                      {servicePoints.map((servicePoint) => (
                        <option key={servicePoint.id} value={servicePoint.id}>
                          {servicePoint.name} – {servicePoint.street},{' '}
                          {servicePoint.city}
                        </option>
                      ))}
                    </select>
                  )}
                  {servicePointsError && <Error message={servicePointsError} />}
                </div>
              )}

              {estimatedDeliveryTime && (
                <p>Beräknad leveranstid: {estimatedDeliveryTime}</p>
              )}
            </div>

            <div className="formGroup">
              <h3 className="headingSize3">Betalning</h3>

              <div className={styles.paymentContent}>
                <p>
                  Du väljer betalningsmetod hos Stripe i nästa steg.
                </p>

                <div className={styles.paymentActions}>
                  {submitError && <Error message={submitError} />}

                  <p className="terms">
                    Genom att slutföra köpet godkänner du våra{' '}
                    <Link to="#">villkor</Link>.
                  </p>

                  <button
                    type="submit"
                    className="checkout"
                    disabled={
                      submitting ||
                      totalWithShipping === null ||
                      (deliveryMethodId === 1 && !servicePointId)
                    }
                  >
                    {submitting ? (
                      <>
                        Förbereder betalning
                        <Ellipsis />
                      </>
                    ) : (
                      'Gå till betalning'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </section>
      </div>
    </>
  )
}
