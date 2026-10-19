export default function slugify(text: string): string {
  const specialCharactersMap: { [key: string]: string } = {
    é: 'e',
    å: 'a',
    ä: 'a',
    ö: 'o'
  }

  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[éåäö]/g, (match) => specialCharactersMap[match]) // Replace special characters
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
}
