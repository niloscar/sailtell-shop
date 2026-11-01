import api from './apiClient'

export type ServicePoint = {
  id: string
  name: string
  street: string
  city: string
  zipcode: string
}

export type ShippingPrices = {
  pickup: number
  home: number
}

export type DeliveryEstimate = {
  deliveryMethodId: number
  serviceCode: string
  startTime: string
  estimatedTimeOfArrival?: {
    timeOfArrival?: string
    dayRangeOfArrival?: {
      daysMinimum: number
      daysMaximum: number
    }
  }
}

export function getServicePoints(postalCode: string) {
  return api.get<ServicePoint[]>('/shipping/service-points', {
    params: { postalCode }
  })
}

export function getShippingPrices(cartUuid: string) {
  return api.get<ShippingPrices>(`/shipping/prices/${cartUuid}`)
}

export function getDeliveryEstimates(destinationPostalCode: string) {
  return api.get<DeliveryEstimate[]>('/shipping/delivery-estimates', {
    params: { destinationPostalCode }
  })
}
