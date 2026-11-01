/**
 * Adapter for interacting with the supplier's product catalog API.
 */

import { parse } from 'csv-parse/sync'
import { XMLParser, XMLValidator } from 'fast-xml-parser'

export type CatalogFormat = 'csv' | 'xml'

export interface ProductCandidate {
  sku: string | undefined
  ean: string
  name: string
  price: number
  stock: number | null
  variants: string[]
}

interface CsvRow {
  artNr?: string
  ean?: string
  benamning?: string
  prisOre?: string
  pris?: string
  lagersaldo?: string
  varianter?: string
}

interface XmlProduct {
  '@_artNr'?: string
  ean?: string
  benamning?: string
  prisOre?: string
  pris?: {
    '#text'?: string
    '@_valuta'?: string
  } | string
  lagersaldo?: string
  varianter?: {
    variant: string[]
  }
}

const BASE_URL = process.env.SUPPLIER_API_URL
const API_KEY = process.env.SUPPLIER_API_KEY || ''
const TIMEOUT_MS = Number(process.env.SUPPLIER_API_TIMEOUT_MS) || 5000
const BRANSCH = process.env.SUPPLIER_BRANSCH || 'sport'

export async function getSupplierCatalog(format: CatalogFormat): Promise<ProductCandidate[]> {
  if (!BASE_URL || !API_KEY) {
    throw new Error('Leverantörens API är inte konfigurerat.')
  }

  if (format !== 'csv' && format !== 'xml') {
    throw new Error('Ogiltigt katalogformat.')
  }

  const url = `${BASE_URL}/export/products.${format}?bransch=${encodeURIComponent(BRANSCH)}`

  try {
    const response = await fetch(url, {
      headers: { 'X-Api-Key': API_KEY },
      signal: AbortSignal.timeout(TIMEOUT_MS)
    })

    if (!response.ok) {
      throw new Error(`Leverantören svarade med HTTP ${response.status}.`)
    }

    const buffer = Buffer.from(await response.arrayBuffer())

    return format === 'csv'
      ? parseCsvCatalog(buffer)
      : parseXmlCatalog(buffer)
  } catch (error) {
    throw new Error('Kunde inte hämta eller tolka leverantörskatalogen.', {
      cause: error
    })
  }
}

function parseCsvCatalog(buffer: Buffer): ProductCandidate[] {
  const encoding = 'windows-1252'
  const text = new TextDecoder(encoding).decode(buffer)

  const rows = parse<CsvRow>(text, {
    columns: true,
    delimiter: ';',
    skip_empty_lines: true,
    trim: true
  })

  return rows.map((row) => ({
    sku: row.artNr,
    ean: row.ean ?? '',
    name: row.benamning ?? '',
    price: parseOre(row.prisOre ?? row.pris),
    stock: parseStock(row.lagersaldo),
    variants: row.varianter
      ? row.varianter.split('|').map((variant) => variant.trim())
      : []
  }))
}

function parseXmlCatalog(buffer: Buffer): ProductCandidate[] {
  const encoding = 'utf-8'
  const text = new TextDecoder(encoding, {
    fatal: true
  }).decode(buffer)

  const validation = XMLValidator.validate(text)

  if (validation !== true) {
    throw new Error('Leverantören skickade ogiltig XML.')
  }

  const parser = new XMLParser({
    ignoreAttributes: false,
    parseTagValue: false,
    parseAttributeValue: false,
    isArray: (name) => name === 'produkt' || name === 'variant'
  })

  const document = parser.parse(text) as {
    katalog?: {
      produkt?: XmlProduct[]
    }
  }

  if (!Array.isArray(document?.katalog?.produkt)) {
    throw new Error('Leverantörens XML saknar en giltig produktlista.')
  }

  return document.katalog.produkt.map((product) => ({
    sku: product['@_artNr'],
    ean: product.ean ?? '',
    name: product.benamning ?? '',
    price: parseOre(
      product.prisOre ??
        (typeof product.pris === 'object'
          ? product.pris?.['#text']
          : product.pris)
    ),
    stock: parseStock(product.lagersaldo),
    variants: product.varianter?.variant ?? []
  }))
}


function parseOre(value: unknown): number {
  const text = String(value ?? '').replace(/\s/g, '')

  return /^\d+$/.test(text) ? Number(text) : NaN
}

function parseStock(value: unknown): number | null {
  const text = String(value ?? '').trim()

  return text === '' ? null : Number(text)
}
