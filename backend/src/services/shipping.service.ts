import {
  getNearestServicePoints,
  getTransitTime,
  type ServicePoint,
  type TransitTime
} from '../integrations/shipping.adapter'
import { getDeliveryMethodPrice } from '../repositories/deliveryMethod.repository'
import { getCart } from './cart.service'

export const PICKUP_DELIVERY_METHOD_ID = 1
export const HOME_DELIVERY_METHOD_ID = 3
export const FREE_SHIPPING_THRESHOLD = 50000

export type DeliveryEstimate = {
  deliveryMethodId: number
  serviceCode: string
  startTime: string
  estimatedTimeOfArrival: TransitTime['estimatedTimeOfArrival']
}

export class ShippingConfigurationError extends Error {}

function getOriginPostalCode(): string {
  const postalCode = process.env.POSTNORD_ORIGIN_POSTAL_CODE?.replace(
    /\s/g,
    ''
  )

  if (!postalCode || !/^\d{5}$/.test(postalCode)) {
    throw new ShippingConfigurationError(
      'POSTNORD_ORIGIN_POSTAL_CODE måste vara ett svenskt postnummer med fem siffror.'
    )
  }

  return postalCode
}

export async function calculateShippingPrice(
  deliveryMethodId: number,
  merchandiseTotal: number
): Promise<number> {
  if (
    !Number.isSafeInteger(merchandiseTotal) ||
    merchandiseTotal < 0
  ) {
    throw new Error('Varusumman måste vara ett giltigt belopp i ören.')
  }

  if (
    deliveryMethodId !== PICKUP_DELIVERY_METHOD_ID &&
    deliveryMethodId !== HOME_DELIVERY_METHOD_ID
  ) {
    throw new Error('Ogiltig leveransmetod.')
  }

  const shippingPrice = await getDeliveryMethodPrice(deliveryMethodId)

  return merchandiseTotal >= FREE_SHIPPING_THRESHOLD ? 0 : shippingPrice
}

export async function getShippingPrices(cartUuid: string) {
  const cart = await getCart(cartUuid)

  if (!cart) {
    return null
  }

  const merchandiseTotal = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return {
    pickup: await calculateShippingPrice(
      PICKUP_DELIVERY_METHOD_ID,
      merchandiseTotal
    ),
    home: await calculateShippingPrice(
      HOME_DELIVERY_METHOD_ID,
      merchandiseTotal
    )
  }
}

export async function validateServicePoint(
  postalCode: string,
  servicePointId: string
): Promise<ServicePoint> {
  const servicePoints = await getNearestServicePoints(postalCode)
  const servicePoint = servicePoints.find(
    (candidate) => candidate.id === servicePointId
  )

  if (!servicePoint) {
    throw new Error('Det valda ombudet är inte giltigt för postnumret.')
  }

  return servicePoint
}

export async function getDeliveryEstimates(
  destinationPostalCode: string
): Promise<DeliveryEstimate[]> {
  const originPostalCode = getOriginPostalCode()
  const { startTime, transitTimes } = await getTransitTime(
    originPostalCode,
    destinationPostalCode
  )

  return transitTimes
    .filter(
      (transitTime) =>
        transitTime.isSupported &&
        (transitTime.service.basicServiceCode === '17' ||
          transitTime.service.basicServiceCode === '19')
    )
    .map((transitTime) => ({
      deliveryMethodId:
        transitTime.service.basicServiceCode === '17'
          ? HOME_DELIVERY_METHOD_ID
          : PICKUP_DELIVERY_METHOD_ID,
      startTime,
      serviceCode: transitTime.service.basicServiceCode,
      estimatedTimeOfArrival: transitTime.estimatedTimeOfArrival
    }))
}
