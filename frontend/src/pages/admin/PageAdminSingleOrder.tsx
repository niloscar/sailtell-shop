import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getOrder, getOrderOptions, updateOrder } from '../../api/orderApi'
import { getCustomer } from '../../api/customerApi'

import { formatDate } from '../../utilities/formatDateTime'
import formatPrice from '../../utilities/formatPrice'
import formatPhoneNumber from '../../utilities/formatPhoneNumber'
import getApiErrorMessage from '../../utilities/apiError'

import type { OrderDetails, OrderOptions } from '../../types/orderTypes'
import type { Customer } from '../../types/customerTypes'
import { ArrowLeftIcon } from '@phosphor-icons/react'

type LoadingState = {
  loading: boolean
  error: string | null
}

type PageLoadingState = {
  order: LoadingState
  customer: LoadingState
  orderOptions: LoadingState
}

type LoadKey = keyof PageLoadingState

export default function PageAdminSingleOrder() {
  const { id } = useParams<{ id: string }>()

  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [orderOptions, setOrderOptions] = useState<OrderOptions | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)

  const [loadingState, setLoadingState] = useState<PageLoadingState>({
    order: {
      loading: true,
      error: null
    },
    customer: {
      loading: false,
      error: null
    },
    orderOptions: {
      loading: true,
      error: null
    }
  })

  const updateLoadingState = (
    key: LoadKey,
    updates: Partial<LoadingState>
  ) => {
    setLoadingState((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...updates
      }
    }))
  }

  useEffect(() => {
    const fetchOrderOptions = async () => {
      updateLoadingState('orderOptions', {
        loading: true,
        error: null
      })

      try {
        const response = await getOrderOptions()

        setOrderOptions(response.data)
      } catch (error) {
        updateLoadingState('orderOptions', {
          error: getApiErrorMessage(error)
        })
      } finally {
        updateLoadingState('orderOptions', {
          loading: false
        })
      }
    }

    fetchOrderOptions()
  }, [])

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return

      updateLoadingState('order', {
        loading: true,
        error: null
      })

      try {
        const response = await getOrder(Number(id))

        setOrder(response.data)
      } catch (error) {
        updateLoadingState('order', {
          error: getApiErrorMessage(error)
        })
      } finally {
        updateLoadingState('order', {
          loading: false
        })
      }
    }

    fetchOrder()
  }, [id])

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!order?.customer_id) return

      updateLoadingState('customer', {
        loading: true,
        error: null
      })

      try {
        const response = await getCustomer(order.customer_id)

        setCustomer(response.data)
      } catch (error) {
        updateLoadingState('customer', {
          error: getApiErrorMessage(error)
        })
      } finally {
        updateLoadingState('customer', {
          loading: false
        })
      }
    }

    fetchCustomer()
  }, [order?.customer_id])

  const handleStatusChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (!order) return

    const statusId = Number(event.target.value)

    try {
      const response = await updateOrder(order.id, {
        status_id: statusId
      })

      setOrder(response.data)
    } catch (error) {
      console.error('Kunde inte uppdatera orderstatus:', error)
    }
  }

  if (loadingState.order.loading || loadingState.orderOptions.loading) return <p>Laddar order...</p>
  if (loadingState.order.error) return <p className="error-message">{loadingState.order.error}</p>
  if (loadingState.orderOptions.error) return <p className="error-message">{loadingState.orderOptions.error}</p>
  if (!order || !orderOptions) return <p className="error-message">Orderdata saknas.</p>

  return (
    <div className="order-details">
      <h1 className="heading-size-1">Order #{order.id}</h1>

      <table>
        <tbody>
          <tr>
            <th>Datum</th>
            <td>{formatDate(order.ordered_at)}</td>
          </tr>
          <tr>
            <th>Ordernummer</th>
            <td>{order.id}</td>
          </tr>
          <tr>
            <th>Kundnummer</th>
            <td>{order.customer_id}</td>
          </tr>
          <tr>
            <th>Summa</th>
            <td>{formatPrice(Number(order.sum))}</td>
          </tr>
          <tr>
            <th>Status</th>
            <td>
              <select
                value={order.order_status.id}
                onChange={handleStatusChange}
              >
                {orderOptions.statuses.map((status) => (
                  <option
                    key={status.id}
                    value={status.id}
                  >
                    {status.name}
                  </option>
                ))}
              </select>
            </td>
          </tr>
        </tbody>
      </table>

      <h2 className="heading-size-2">Produkter</h2>

      <table>
        <thead>
          <tr>
            <th>Produkt</th>
            <th>Varumärke</th>
            <th>Antal</th>
            <th>Pris</th>
          </tr>
        </thead>
        <tbody>
          {order.order_items.map((item) => (
            <tr key={item.id}>
              <td>
                <Link to={`/product/${item.product_id}`}>{item.name}</Link>
              </td>
              <td>{item.brand_name}</td>
              <td>{item.quantity}</td>
              <td>{formatPrice(Number(item.unit_price))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="heading-size-2">Leveransadress</h2>

      {order.shipping_address ? (
        <table>
          <thead>
            <tr>
              <th>Gatuadress</th>
              <th>Postnummer</th>
              <th>Stad</th>
              <th>Land</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{order.shipping_address.street}</td>
              <td>{order.shipping_address.zipcode}</td>
              <td>{order.shipping_address.city}</td>
              <td>{order.shipping_address.country}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>Ingen leveransadress tillgänglig</p>
      )}

      <h2 className="heading-size-2">Kunduppgifter</h2>

      {loadingState.customer.loading ? (
        <p>Laddar kunduppgifter...</p>
      ) : loadingState.customer.error ? (
        <p className="error-message">
          {loadingState.customer.error}
        </p>
      ) : customer ? (
        <table>
          <thead>
            <tr>
              <th>Kundnummer</th>
              <th>Förnamn</th>
              <th>Efternamn</th>
              <th>Email</th>
              <th>Telefonnummer</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{customer.id}</td>
              <td>{customer.fname}</td>
              <td>{customer.lname}</td>
              <td>{customer.email}</td>
              <td>
                {customer.phone && formatPhoneNumber(customer.phone)}
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>Inga kunduppgifter tillgängliga.</p>
      )}

      <Link 
        to="/admin/orders"
        className="link-back"
      >
        <ArrowLeftIcon size={20} />
        Tillbaka till orderlistan
      </Link>
    </div>
  )
}