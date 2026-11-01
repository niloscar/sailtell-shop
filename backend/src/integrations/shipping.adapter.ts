import { z } from 'zod'

const BASE_URL = process.env.POSTNORD_API_URL
const API_KEY = process.env.POSTNORD_API_KEY
const TIMEOUT_MS = 5000

const servicePointSchema = z.object({
  servicePointId: z.string(),
  name: z.string(),
  visitingAddress: z.object({
    streetName: z.string(),
    streetNumber: z.string().optional(),
    postalCode: z.string(),
    city: z.string()
  })
})

const servicePointsResponseSchema = z.object({
  servicePointInformationResponse: z.object({
    servicePoints: z.array(servicePointSchema)
  })
})

const transitTimeResponseSchema = z.object({
  service: z.object({
    basicServiceCode: z.string()
  }),
  isSupported: z.boolean(),
  estimatedTimeOfArrival: z
    .object({
      timeOfArrival: z.string().optional(),
      dayRangeOfArrival: z
        .object({
          daysMinimum: z.number(),
          daysMaximum: z.number()
        })
        .optional()
    })
    .optional()
})

export interface ServicePoint {
  id: string
  name: string
  street: string
  city: string
  zipcode: string
}

export type TransitTime = z.infer<typeof transitTimeResponseSchema>

export type TransitTimeResult = {
  startTime: string
  transitTimes: TransitTime[]
}

function getBaseUrl() {
  if (!BASE_URL) {
    throw new Error('PostNords API-adress är inte konfigurerad.')
  }

  return BASE_URL
}

function getApiKey() {
  if (!API_KEY) {
    throw new Error('PostNords API är inte konfigurerat.')
  }

  return API_KEY
}

async function fetchPostNord(url: string) {
  let response: Response

  try {
    response = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT_MS)
    })
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      throw new Error('PostNords API svarade inte inom 5 sekunder.')
    }

    throw new Error('Kunde inte nå PostNords API.', { cause: error })
  }

  if (!response.ok) {
    throw new Error(`PostNord svarade med HTTP ${response.status}.`)
  }

  try {
    return await response.json()
  } catch (error) {
    throw new Error('PostNord skickade ett ogiltigt JSON-svar.', {
      cause: error
    })
  }
}

export async function getNearestServicePoints(
  postalCode: string
): Promise<ServicePoint[]> {
  const params = new URLSearchParams({
    apikey: getApiKey(),
    returnType: 'json',
    countryCode: 'SE',
    postalCode,
    numberOfServicePoints: '5'
  })

  const data = await fetchPostNord(
    `${getBaseUrl()}/businesslocation/v5/servicepoints/nearest/byaddress?${params}`
  )

  const result = servicePointsResponseSchema.safeParse(data)

  if (!result.success) {
    throw new Error('PostNord skickade ett oväntat ombudssvar.')
  }

  return result.data.servicePointInformationResponse.servicePoints.map(
    (servicePoint) => ({
      id: servicePoint.servicePointId,
      name: servicePoint.name,
      street: [
        servicePoint.visitingAddress.streetName,
        servicePoint.visitingAddress.streetNumber
      ]
        .filter(Boolean)
        .join(' '),
      city: servicePoint.visitingAddress.city,
      zipcode: servicePoint.visitingAddress.postalCode
    })
  )
}

export async function getTransitTime(
  originPostalCode: string,
  destinationPostalCode: string
): Promise<TransitTimeResult> {
  const now = new Date()
  const pad = (value: number) => value.toString().padStart(2, '0')
  const startTime = [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate())
  ].join('-') + `T${pad(now.getHours())}:${pad(now.getMinutes())}`

  const params = new URLSearchParams({
    apikey: getApiKey(),
    startTime,
    serviceCodes: '17,19',
    originPostalCode,
    originCountryCode: 'SE',
    destinationPostalCode,
    destinationCountryCode: 'SE'
  })

  const data = await fetchPostNord(
    `${getBaseUrl()}/transport/v2/transittime/addresstoaddress?${params}`
  )

  const result = z.array(transitTimeResponseSchema).safeParse(data)

  if (!result.success) {
    throw new Error('PostNord skickade ett oväntat leveranstidssvar.')
  }

  return { startTime, transitTimes: result.data }
}
