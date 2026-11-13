import { useState } from 'react'
import type { ChangeEvent, SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function PageAdminLogin() {
  const navigate = useNavigate()
  const { login, loginError } = useAuth()

  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value
    }))
  }

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault()

    const user = await login({
      email: credentials.email.trim(),
      password: credentials.password.trim()
    })

    if (!user) return

    navigate(user.role === 'admin' ? '/admin' : '/my-account')
  }

  return (
    <div className="loginPage">
      <h1 className="headingSize1">Logga in</h1>

      <form className="admin-login-form" onSubmit={handleSubmit}>
        <div className="inputGroup">
          <label htmlFor="email">Mail</label>
          <input
            type="email"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="inputGroup">
          <label htmlFor="password">Lösenord</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Logga in</button>

        {loginError && <p className="errorMessage">{loginError}</p>}
      </form>
    </div>
  )
}
