export default function formatDateTime(dateTimeString: string): string {
  const date = new Date(dateTimeString)
  return date.toLocaleString('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

export function formatDate(dateTimeString: string): string {
  const date = new Date(dateTimeString)
  return date.toLocaleString('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export function formatTime(dateTimeString: string): string {
  const date = new Date(dateTimeString)
  return date.toLocaleString('sv-SE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

export function timeAgo(dateTimeString: string): string {
  const date = new Date(dateTimeString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds} sekunder sedan`
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minuter sedan`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} timmar sedan`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} dagar sedan`
  }
}
