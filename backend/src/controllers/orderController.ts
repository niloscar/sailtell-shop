/**
 * Controller functions for handling order-related API endpoints.
 */

import { Request, Response } from 'express'
import { getOrders, getOrder, createOrder, updateOrder, deleteOrder } from '../services/orderService'

type OrderParams = {
  id: string
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
  const newOrder = req.body
  const order = await createOrder(
    newOrder.customer_id,
    newOrder.payment_method_id,
    newOrder.delivery_method_id,
    newOrder.ordered_at,
    newOrder.sum
  )
  res.status(201).json(order)
}

export async function updateOrderHandler(req: Request<OrderParams>, res: Response) {
  const orderId = parseInt(req.params.id)
  const order = await updateOrder(orderId, req.body)

  if (order) {
    res.json(order)
  } else {
    res.status(404).json({ error: 'Ordern kunde inte hittas.' })
  }
}

export async function deleteOrderHandler(req: Request<OrderParams>, res: Response) {
  const orderId = parseInt(req.params.id)
  await deleteOrder(orderId)
  res.status(204).send()
}