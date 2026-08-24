export interface Product {
  id: number
  name: string
  description: string
  brand: string
  details: []
  img_url: string
  stock: number,
  purchase_type: 'webshop' | 'external',
  product_distribution_links: ProductDistributionLink[],
  price: number
}

export interface ProductDistributionLink {
  id: number
  distributor: string
  download_url: string
  badge_url: string
}