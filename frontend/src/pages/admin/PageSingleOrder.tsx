import { getOrder } from '../../api/orderApi'
import { getCustomer } from '../../api/customerApi'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import formatPrice from '../../utilities/formatPrice'
import type { OrderDetails } from '../../types/orderTypes'
import type { Customer } from '../../types/customerTypes'

function PageSingleOrder() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)

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

  console.log('Fetched order:', order) // Debugging line to check the fetched order

  return (
    <div className='order-details'>
      <h2>Order #{order?.id}</h2>
      <table>
        <tbody>
          <tr>
            <th>Datum</th>
            <td>{order?.ordered_at}</td>
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
            <td>{order?.order_status?.name || 'Ingen status'}</td>
          </tr>
        </tbody>
      </table>
      <h2>Orderdetaljer</h2>
      <h3>Produkter</h3>
      <table>
        <thead>
          <tr>
            <th>Produkt</th>
            <th>Tillverkare</th>
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
      <h3>Kunduppgifter</h3>
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
            <td>{customer?.phone}</td>
          </tr>
        </tbody>
      </table>
      <h3>Leveransadress</h3>
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
      <Link to="/admin">Tillbaka till orderlistan</Link>
    </div>
  )
}

export default PageSingleOrder