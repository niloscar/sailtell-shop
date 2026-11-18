import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { GithubLogoIcon, GoogleLogoIcon } from '@phosphor-icons/react'

import type { ChangeEvent, SubmitEvent } from 'react'

const AUTH_ERRORS: Record<string, string> = {
  cancelled: 'Inloggningen avbröts.',
  state: 'Inloggningen kunde inte verifieras. Försök igen.',
  google: 'Inloggningen med Google misslyckades. Försök igen.',
  github: 'Inloggningen med GitHub misslyckades. Försök igen.',
  'github-not-admin': 'Ditt GitHub-konto saknar administratörsbehörighet.',
  'not-verified': 'E-postadressen är inte verifierad hos Google.',
  'email-conflict': 'Det finns redan ett konto med den här e-postadressen. Logga in med lösenord.'
}

export default function PageLogin() {
  const [credentials, setCredentials] = useState({ email: '', password: '' })

  const navigate = useNavigate()
  const { login, loginError } = useAuth()

  const [searchParams, setSearchParams] = useSearchParams()

  const authError = searchParams.get('error')
  const authErrorMessage = authError
    ? AUTH_ERRORS[authError] ?? 'Ett okänt fel inträffade vid inloggningen.'
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

        {(loginError || authErrorMessage) && (
          <p className="errorMessage" role="alert">
            {loginError || authErrorMessage}
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
