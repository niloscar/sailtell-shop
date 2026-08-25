export default function formatPrice(price: number): string {
  const hasDecimals = !Number.isInteger(price)

  return price.toLocaleString('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2
  })
}