import type { Customer } from "../../types/customerTypes"
import { useEffect, useState } from "react"
import { getCustomers } from "../../api/customerApi"
import formatPhoneNumber from "../../utilities/formatPhoneNumber"

export default function PageAdminCustomers() {
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
            <th>Kund.nr</th>
            <th>Namn</th>
            <th>Email</th>
            <th>Mobil</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer: Customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.fname} {customer.lname}</td>
              <td>{customer.email}</td>
              <td>{customer.phone && formatPhoneNumber(customer.phone)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}