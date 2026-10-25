import { z } from 'zod'
import fetchJson from '../lib/fetchJson'
import { Product } from '@shop/shared'

const BASE_URL = process.env.SUPPLIER_API_URL
const API_KEY = process.env.SUPPLIER_API_KEY || ''
const TIMEOUT_MS = Number(process.env.SUPPLIER_API_TIMEOUT_MS) || 5000
const CACHE_SECONDS = Number(process.env.SUPPLIER_CACHE_SECONDS) || 0
const BRANSCH = process.env.SUPPLIER_BRANSCH || 'sport'
const PAGE_SIZE = 20

const SupplierProduct = z.object({
  artNr: z.string(),
  benamning: z.string(),
  kategori: z.string(),
  prisOre: z.int().nonnegative(),
  lagersaldo: z.int().nullable(),
  varianter: z.string(),
  uppdaterad: z.iso.datetime(),
})

type SupplierProduct = z.infer<typeof SupplierProduct>

const SupplierResponse = z.object({
  data: z.array(z.unknown())
})

function supplierProductToProduct(product: SupplierProduct): Product {
  return {
    id: product.artNr,
    name: product.benamning,
    brand_name: 'Leverantörsvarumärke',
    description: product.benamning,
    details: [],
    img_url: '',
    categories: [{ id: null, name: product.kategori }],
    price: product.prisOre * 0.01,
    stock: product.lagersaldo,
    purchase_type: 'webshop',
    product_distribution_links: [],
    // variants: product.varianter,
    // updatedAt: product.uppdaterad,
  }
}

async function fetchSupplierProducts() {
  const url = `${BASE_URL}/products?bransch=${BRANSCH}&pageSize=${PAGE_SIZE}`
  const data = await fetchJson(url, {
    headers: { 'X-API-Key': API_KEY },
    timeoutMs: TIMEOUT_MS
  })

  const parsed = SupplierResponse.safeParse(data)

  // Whole response has the wrong formmat
  if (!parsed.success) throw new Error(`The supplier responded with an unexpected format: ${z.prettifyError(parsed.error)}`)

  // One product has the wrong format
  const products: Product[] = []
  let skippedCount = 0

  for (const raw of parsed.data.data) {
    const result = SupplierProduct.safeParse(raw)

    if (result.success) {
      products.push(supplierProductToProduct(result.data))
    } else {
      skippedCount++
      console.warn(`Skipping product due to unexpected format: ${z.prettifyError(result.error)}`)
    }
  }

  return { products, skippedCount }
}

type Catalog = {
  products: Product[]
  skippedCount: number
  fetchedAt: string
}

let cache: { value: Catalog, expiresAt: number } | null = null

export async function getSupplierProducts(): Promise<Catalog & { fromCache: boolean }> {
  if (cache && cache.expiresAt > Date.now()) {
    return { ...cache.value, fromCache: true }
  }

  const value: Catalog = {
    ...(await fetchSupplierProducts()),
    fetchedAt: new Date().toISOString()
  }

  cache = {
    value,
    expiresAt: Date.now() + CACHE_SECONDS * 1000
  }

  return { ...value, fromCache: false }
}
