import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getOrders } from '../../api/orderApi'
import { getCustomers } from '../../api/customerApi'

import type { Order } from '../../types/orderTypes'
import type { Customer } from '../../types/customerTypes'


function PageAdmin() {
  return (
    <div>
      <h1>Admin Page</h1>
      <OrdersList />
      <CustomersList />
    </div>
  )
}

export default PageAdmin

function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders()
        setOrders(response.data)
      } catch (error) {
        console.error('Kunde inte hämta ordrar:', error)
      }
    }

    fetchOrders()
  }, [])

  const navigate = useNavigate()

  return (
    <div>
      <h2>Ordrar</h2>
      <table>
        <thead>
          <tr>
            <th>Datum</th>
            <th>Order ID</th>
            <th>Kund ID</th>
            <th>Summa</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: Order) => (
            <tr key={order.id} onClick={() => navigate(`order/${order.id}`)}>
              <td>{order.ordered_at}</td>
              <td>{order.id}</td>
              <td>{order.customer_id}</td>
              <td>{order.sum}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CustomersList() {
  const [customers, setCustomers] = useState<Customer[]>([])

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getCustomers()
        setCustomers(response.data)
      } catch (error) {
        console.error('Kunde inte hämta kunder:', error)
      }
    }

    fetchCustomers()
  }, [])

  return (
    <div>
      <h2>Kunder</h2>
      <table>
        <thead>
          <tr>
            <th>Kund ID</th>
            <th>Namn</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer: Customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.fname} {customer.lname}</td>
              <td>{customer.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}