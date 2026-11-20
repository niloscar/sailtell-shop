
import { getOrder } from './order.service'
import { getCustomer } from './customer.service'
import { sendEmail } from '../integrations/email.adapter'
import { createOrderConfirmationTemplate } from '../templates/orderConfirmation.template'

export async function sendOrderConfirmation(orderId: number) {
  const order = await getOrder(orderId)
  const customer = await getCustomer(order.customer_id)

  const { subject, html, text } = createOrderConfirmationTemplate(order, customer)

  return sendEmail({
    to: customer.email,
    subject,
    html,
    text,
    orderId
  })
}
