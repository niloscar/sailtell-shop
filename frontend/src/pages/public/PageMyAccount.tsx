import { useAuth } from '../../contexts/AuthContext'

export default function PageMyAccount() {
  const { user, logout } = useAuth()

  return (
    <div>
      <h1 className="headingSize1">Mitt användarkonto</h1>
      <p>Välkommen, {user?.fname}!</p>

      <h2>Orderhistorik</h2>
      <ul>
        <li>Order #12345 - 2023-06-01 - Levererad</li>
        <li>Order #67890 - 2023-05-15 - Levererad</li>
        <li>Order #54321 - 2023-04-20 - Avbruten</li>
      </ul>

      <button
        className="btn"
        onClick={() => logout()}
      >
        Logga ut
      </button>
    </div>
  )
}
