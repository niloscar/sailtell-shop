import { getOrder, getOrderOptions, updateOrder } from '../../api/orderApi'
import { getCustomer } from '../../api/customerApi'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { formatDate } from '../../utilities/formatDateTime'
import formatPrice from '../../utilities/formatPrice'
import type { OrderDetails, OrderOptions } from '../../types/orderTypes'
import type { Customer } from '../../types/customerTypes'
import formatPhoneNumber from '../../utilities/formatPhoneNumber'


export default function PageAdminSingleOrder() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [orderOptions, setOrderOptions] = useState<OrderOptions | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    const fetchOrderOptions = async () => {
      try {
        const response = await getOrderOptions()
        setOrderOptions(response.data)
      } catch (error) {
        console.error('Kunde inte hämta orderalternativ:', error)
      }
    }

    fetchOrderOptions()
  }, [])

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrder(Number(id))
        setOrder(response.data)
      } catch (error) {
        console.error('Kunde inte hämta order:', error)
      }
    }

    fetchOrder()
  }, [id])

  useEffect(() => {
    const fetchCustomer = async () => {
      if (order?.customer_id) {
        try {
          const response = await getCustomer(order.customer_id)
          setCustomer(response.data)
        } catch (error) {
          console.error('Kunde inte hämta kund:', error)
        }
      }
    }

    fetchCustomer()
  }, [order?.customer_id])

  const handleStatusChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const statusId = Number(event.target.value)

    if (!order) return

    try {
      const response = await updateOrder(order.id, {
        status_id: statusId
      })

      console.log('Updated order:', response.data) // Debugging line to check the updated order

      setOrder(response.data)
    } catch (error) {
      console.error('Kunde inte uppdatera orderstatus:', error)
    }
  }

  if (!order || !orderOptions) {
    return <p>Laddar order...</p>
  }

  return (
    <div className='order-details'>
      <h1 className="heading-size-1">Order #{order?.id}</h1>
      <table>
        <tbody>
          <tr>
            <th>Datum</th>
            <td>{formatDate(order?.ordered_at)}</td>
          </tr>
          <tr>
            <th>Ordernummer</th>
            <td>{order?.id}</td>
          </tr>
          <tr>
            <th>Kundnummer</th>
            <td>{order?.customer_id}</td>
          </tr>
          <tr>
            <th>Summa</th>
            <td>{formatPrice(Number(order?.sum))}</td>
          </tr>
          <tr>
            <th>Status</th>
            <td>
              <select
                value={order.order_status.id}
                onChange={handleStatusChange}
              >
                {orderOptions.statuses.map(status => (
                  <option key={status.id} value={status.id}>
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
          {order?.order_items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.brand_name}</td>
              <td>{item.quantity}</td>
              <td>{formatPrice(Number(item.unit_price))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="heading-size-2">Leveransadress</h2>
      {order?.shipping_address ? (
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
            <td>{customer?.id}</td>
            <td>{customer?.fname}</td>
            <td>{customer?.lname}</td>
            <td>{customer?.email}</td>
            <td>{customer?.phone && formatPhoneNumber(customer.phone)}</td>
          </tr>
        </tbody>
      </table>

      <Link to="/admin">Tillbaka till orderlistan</Link>
    </div>
  )
}