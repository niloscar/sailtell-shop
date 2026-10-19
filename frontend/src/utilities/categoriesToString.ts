export default function categoriesToString(
  categories: { name: string }[]
): string {
  return categories.map((cat) => cat.name).join(', ')
}
