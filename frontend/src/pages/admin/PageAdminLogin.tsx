import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const success = await login({
      email: credentials.email.trim(),
      password: credentials.password.trim()
    })

    if (success) {
      navigate('/admin')
    }
  }

  return (
    <div className="admin-login-page">
      <h1 className="heading-size-1">Admin login</h1>

      <form
        className="admin-login-form"
        onSubmit={handleSubmit}
      >
        <div className="input-group">
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

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">
          Login
        </button>

        {loginError && (
          <p className="error-message">
            {loginError}
          </p>
        )}
      </form>
    </div>
  )
}