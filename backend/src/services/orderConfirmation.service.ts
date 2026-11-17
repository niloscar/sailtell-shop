
import { getOrder } from './order.service'
import { getCustomer } from './customer.service'
import { sendEmail } from '../integrations/email.adapter'

const priceFormatter = new Intl.NumberFormat('sv-SE', {
  style: 'currency',
  currency: 'SEK'
})

function formatPrice(ore: number) {
  return priceFormatter.format(ore / 100)
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function sendOrderConfirmation(orderId: number) {
  const order = await getOrder(orderId)
  const customer = await getCustomer(order.customer_id)

  const customerName = `${customer.fname} ${customer.lname}`
  const subject = `Orderbekräftelse #${order.id}`

  const items = order.order_items.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    unitPrice: formatPrice(item.unit_price),
    total: formatPrice(item.unit_price * item.quantity)
  }))

  const text = [
    `Hej ${customerName}!`,
    '',
    `Tack för din beställning! Din order #${order.id} är betald.`,
    '',
    'Produkter:',
    ...items.map((item) =>
      `${item.name}: ${item.quantity} × ${item.unitPrice} = ${item.total}`
    ),
    '',
    `Frakt: ${formatPrice(order.shipping_price)}`,
    `Totalt: ${formatPrice(order.sum)}`
  ].join('\n')

  const html = `
    <h1>Orderbekräftelse #${order.id}</h1>
    <p>Hej ${escapeHtml(customerName)}!</p>
    <p>Tack för din beställning! Din order är betald.</p>
    <h2>Produkter</h2>
    <ul>
      ${items.map((item) => `
        <li>
          ${escapeHtml(item.name)}:
          ${item.quantity} × ${item.unitPrice} = ${item.total}
        </li>
      `).join('')}
    </ul>
    <p>Frakt: ${formatPrice(order.shipping_price)}</p>
    <p><strong>Totalt: ${formatPrice(order.sum)}</strong></p>
  `

  return sendEmail({
    to: customer.email,
    subject,
    html,
    text,
    orderId
  })
}
