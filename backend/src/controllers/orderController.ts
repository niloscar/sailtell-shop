/**
 * Controller functions for handling order-related API endpoints.
 */

import { Request, Response } from 'express'
import { getOrderOptions, getOrders, getOrder, createOrder, deleteOrder } from '../services/orderService'
import { updateOrderStatus } from '../services/orderStatusService'

type OrderParams = {
  id: string
}

export async function getOrderOptionsHandler(req: Request, res: Response) {
  const orderOptions = await getOrderOptions()
  res.json(orderOptions)
}

export async function getOrdersHandler(req: Request, res: Response) {
  const orders = await getOrders()
  res.json(orders)
}

export async function getOrderHandler(req: Request<OrderParams>, res: Response) {
  const orderId = parseInt(req.params.id)
  const order = await getOrder(orderId)

  if (order) {
    res.json(order)
  } else {
    res.status(404).json({ error: 'Ordern kunde inte hittas.' })
  }
}

export async function createOrderHandler(req: Request, res: Response) {
  const newOrder = await createOrder(req.body)
  res.status(201).json(newOrder)
}

export async function updateOrderHandler(req: Request, res: Response) {
  try {
    const orderId = Number(req.params.id)
    const { status_id } = req.body

    if (status_id !== undefined) {
      await updateOrderStatus(orderId, status_id)
    }

    const order = await getOrder(orderId)

    res.json(order)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Kunde inte uppdatera ordern.' })
  }
}

export async function deleteOrderHandler(req: Request<OrderParams>, res: Response) {
  const orderId = parseInt(req.params.id)
  await deleteOrder(orderId)
  res.status(204).send()
}