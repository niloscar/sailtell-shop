const BASE_URL = 'https://api.frankfurter.dev/v1/'

interface getRatesProps {
  date: string
  base: string
  symbols: string[]
}

interface FrankfurterRatesResponse {
  amount: number
  base: string
  date: string
  rates: Record<string, number>
}

export async function getRates({ date, base, symbols }: getRatesProps) {
  const params = new URLSearchParams({
    date,
    base,
    symbols: symbols.join(',')
  })

  const url = `${BASE_URL}${date}?${params.toString()}`

  try {
    const response = await fetch(url)
    const data = (await response.json()) as FrankfurterRatesResponse

    return {
      base: data.base,
      date: data.date,
      rates: data.rates
    }
  } catch (error) {
    throw new Error(`Failed to fetch rates`)
  }
}

export async function getCurrencies() {
  const url = `${BASE_URL}currencies`

  try {
    const response = await fetch(url)
    const data = await response.json()

    return data
  } catch (error) {
    throw new Error(`Failed to fetch currencies`)
  }
}
