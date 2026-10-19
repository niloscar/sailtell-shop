import axios from 'axios'

const errorMessages: Record<number, string> = {
  400: 'Felaktig förfrågan.',
  401: 'Du är inte inloggad.',
  403: 'Du saknar behörighet.',
  404: 'Resursen kunde inte hittas.',
  409: 'En konflikt uppstod.',
  500: 'Ett serverfel inträffade.',
  503: 'Tjänsten är tillfälligt otillgänglig.'
}

type ApiErrorResponse = {
  error?: string
  message?: string
}

export default function getApiErrorMessage(error: unknown): string {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return 'Ett oväntat fel inträffade.'
  }

  if (!error.response) {
    return 'Kunde inte ansluta till servern.'
  }

  const { status, data } = error.response

  return (
    data.message ??
    data.error ??
    errorMessages[status] ??
    `Ett oväntat fel inträffade (${status}).`
  )
}
