export default function formatPrice(price: number): string {
  return price.toLocaleString(
    'sv-SE', 
    { 
      style: 'currency', 
      currency: 'SEK' 
    })
}