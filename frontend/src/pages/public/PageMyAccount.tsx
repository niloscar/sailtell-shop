import { useAuth } from '../../contexts/AuthContext'

export default function PageMyAccount() {
  const { user, logout } = useAuth()

  return (
    <div>
      <h1 className="headingSize1">Mitt användarkonto</h1>
      <p>Välkommen, {user?.fname}!</p>
      <button
        className="btn"
        onClick={() => logout()}
      >
        Logga ut
      </button>
    </div>
  )
}
