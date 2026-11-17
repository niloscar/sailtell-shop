export default function formatPrice(price: number): string {
  return (price / 100).toLocaleString('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: price % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  })
}
