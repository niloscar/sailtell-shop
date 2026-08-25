import type { Customer } from "../../types/customerTypes"
import { useEffect, useState } from "react"
import { getCustomers } from "../../api/customerApi"
import formatPhoneNumber from "../../utilities/formatPhoneNumber"
import getApiErrorMessage from "../../utilities/apiError"

export default function PageAdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingError, setLoadingError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true)
        const response = await getCustomers()
        setCustomers(response.data)
      } catch (error) {
        setLoadingError(getApiErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  if (loading) return <p>Laddar kunder...</p>
  if (loadingError) return <p className="error-message">{loadingError}</p>
  if (customers.length === 0) return <p>Inga kunder hittades.</p>

  return (
    <>
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
    </>
  )
}