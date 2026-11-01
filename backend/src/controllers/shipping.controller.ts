import { z } from 'zod'
import type { Request, Response } from 'express'

import { getNearestServicePoints } from '../integrations/shipping.adapter'
import {
  getDeliveryEstimates,
  getShippingPrices,
  ShippingConfigurationError
} from '../services/shipping.service'

const postalCodeSchema = z
  .string()
  .transform((value) => value.replace(/\s/g, ''))
  .refine((value) => /^\d{5}$/.test(value), {
    message: 'Postnumret måste bestå av fem siffror.'
  })

const servicePointsQuerySchema = z.object({
  postalCode: postalCodeSchema
})

const deliveryEstimatesQuerySchema = z.object({
  destinationPostalCode: postalCodeSchema
})

export async function getServicePointsHandler(req: Request, res: Response) {
  const parsed = servicePointsQuerySchema.safeParse(req.query)

  if (!parsed.success) {
    res.status(400).json({ message: 'Ogiltigt postnummer.' })
    return
  }

  try {
    const servicePoints = await getNearestServicePoints(parsed.data.postalCode)
    res.json(servicePoints)
  } catch {
    res.status(502).json({
      message: 'Kunde inte hämta ombud från PostNord.'
    })
  }
}

export async function getDeliveryEstimatesHandler(
  req: Request,
  res: Response
) {
  const parsed = deliveryEstimatesQuerySchema.safeParse(req.query)

  if (!parsed.success) {
    res.status(400).json({ message: 'Ogiltigt postnummer.' })
    return
  }

  try {
    const deliveryEstimates = await getDeliveryEstimates(
      parsed.data.destinationPostalCode
    )
    res.json(deliveryEstimates)
  } catch (error) {
    if (error instanceof ShippingConfigurationError) {
      res.status(500).json({ message: error.message })
      return
    }

    res.status(502).json({
      message: 'Kunde inte hämta leveranstider från PostNord.'
    })
  }
}

export async function getShippingPricesHandler(
  req: Request<{ cartUuid: string }>,
  res: Response
) {
  const shippingPrices = await getShippingPrices(req.params.cartUuid)

  if (!shippingPrices) {
    res.status(404).json({ message: 'Kundvagnen kunde inte hittas.' })
    return
  }

  res.json(shippingPrices)
}
