export default function formatPostalCode(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 5)

  if (digits.length <= 3) return digits

  return `${digits.slice(0, 3)} ${digits.slice(3)}`
}
