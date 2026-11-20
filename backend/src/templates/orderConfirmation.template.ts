
import type { Order } from '../types/order.types'
import type { Customer } from '../types/customer.types'

const priceFormatter = new Intl.NumberFormat('sv-SE', {
  style: 'currency',
  currency: 'SEK',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
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

export function createOrderConfirmationTemplate(order: Order, customer: Customer) {
  const clientUrl = process.env.CLIENT_URL

  if (!clientUrl) throw new Error('CLIENT_URL saknas i miljövariablerna.')

  const shopUrl = new URL('/', clientUrl).toString()
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
    `Totalt: ${formatPrice(order.sum)}`,
    '',
    `Tillbaka till SailTell Shop: ${shopUrl}`
  ].join('\n')

  const cellStyle = 'padding:12px 6px; border-bottom:1px solid #e2e8f0; font-size:14px; line-height:20px; color:#334155;'
  const headerStyle = 'padding:10px 6px; border-bottom:1px solid #cbd5e1; font-size:12px; line-height:18px; color:#64748b; font-weight:bold;'

  const html = `
    <!DOCTYPE html>
    <html lang="sv">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial,Helvetica,sans-serif; color:#1b2935;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; background-color:#f4f6f8;">
          <tr>
            <td align="center" style="padding:24px 12px;">
              <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px; border-collapse:collapse; background-color:#ffffff;">
                <tr>
                  <td style="padding:32px 28px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="font-size:20px; font-weight:bold; color:#1b2935;">
                          SailTell Shop
                        </td>
                        <td align="right" style="font-size:13px; color:#64748b; white-space:nowrap;">
                          Order #${order.id}
                        </td>
                      </tr>
                    </table>

                    <div style="border-top:1px solid #e2e8f0; margin:24px 0;"></div>

                    <h1 style="margin:0 0 24px; font-size:24px; line-height:32px; color:#1b2935;">
                      Tack för din beställning!
                    </h1>

                    <p style="margin:0 0 12px; font-size:15px; line-height:24px; color:#475569;">
                      Hej ${escapeHtml(customer.fname)}!
                    </p>

                    <p style="margin:0 0 32px; font-size:15px; line-height:24px; color:#475569;">
                      Din betalning har genomförts och din order är bekräftad.
                    </p>

                    <h2 style="margin:0 0 16px; font-size:17px; line-height:24px; color:#1b2935;">
                      Ordersammanställning
                    </h2>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse:collapse;">
                      <thead>
                        <tr>
                          <th align="left" style="${headerStyle}">Produkt</th>
                          <th align="center" style="${headerStyle}">Antal</th>
                          <th align="right" style="${headerStyle}">Styckpris</th>
                          <th align="right" style="${headerStyle}">Summa</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${items.map((item) => `
                          <tr>
                            <td style="${cellStyle}">${escapeHtml(item.name)}</td>
                            <td align="center" style="${cellStyle}">${item.quantity}</td>
                            <td align="right" style="${cellStyle} white-space:nowrap;">${item.unitPrice}</td>
                            <td align="right" style="${cellStyle} white-space:nowrap;">${item.total}</td>
                          </tr>
                        `).join('')}
                        <tr>
                          <td style="${cellStyle}">Frakt</td>
                          <td style="${cellStyle}"></td>
                          <td style="${cellStyle}"></td>
                          <td align="right" style="${cellStyle} white-space:nowrap;">${formatPrice(order.shipping_price)}</td>
                        </tr>
                      </tbody>
                    </table>

                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;">
                      <tr>
                        <td style="font-size:17px; font-weight:bold; color:#1b2935;">
                          Totalt betalt
                        </td>
                        <td align="right" style="font-size:20px; font-weight:bold; color:#1b2935; white-space:nowrap;">
                          ${formatPrice(order.sum)}
                        </td>
                      </tr>
                    </table>

                    <div style="border-top:1px solid #e2e8f0; margin:32px 0 24px;"></div>

                    <p style="margin:0; text-align:center; font-size:14px; line-height:22px;">
                      <a href="${escapeHtml(shopUrl)}" style="color:#334155; text-decoration:underline;">
                        SailTell Shop
                      </a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `

  return { subject, html, text }
}
