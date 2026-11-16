import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { GithubLogoIcon, GoogleLogoIcon } from '@phosphor-icons/react'

import type { ChangeEvent, SubmitEvent } from 'react'

const GOOGLE_ERRORS: Record<string, string> = {
  cancelled: 'Google-inloggningen avbröts.',
  state: 'Inloggningen kunde inte verifieras. Försök igen.',
  google: 'Inloggningen med Google misslyckades. Försök igen.',
  'not-verified': 'E-postadressen är inte verifierad hos Google.',
  'email-conflict': 'Det finns redan ett konto med den här e-postadressen. Logga in med lösenord.'
}

export default function PageLogin() {
  const [credentials, setCredentials] = useState({ email: '', password: '' })

  const navigate = useNavigate()
  const { login, loginError } = useAuth()

  const [searchParams, setSearchParams] = useSearchParams()

  const googleError = searchParams.get('error')
  const googleErrorMessage = googleError
    ? GOOGLE_ERRORS[googleError] ?? 'Ett okänt fel inträffade vid Google-inloggningen.'
    : null

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value
    }))
  }

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault()
    setSearchParams({}, { replace: true })

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

        {(loginError || googleErrorMessage) && (
          <p className="errorMessage" role="alert">
            {loginError || googleErrorMessage}
          </p>
        )}

        <button type="submit">Logga in</button>

        <ul className="alternative-login">
          <li>
            <a href="/api/auth/google" className="link-google">
              <GoogleLogoIcon />
              <span>Logga in med Google</span>
            </a>
          </li>
          <li>
            <a href="/api/auth/github" className="link-github">
              <GithubLogoIcon />
              <span>Logga in med GitHub</span>
            </a>
          </li>
        </ul>
      </form>
    </div>
  )
}
