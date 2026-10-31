import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getProductOptions,
  createProduct,
  uploadProductImage
} from '../../api/productApi'
import getApiErrorMessage from '../../utilities/apiError'
import BackLink from '../../components/BackLink'
import Spinner from '../../components/ui/Spinner'
import Error from '../../components/ui/Error'
import Ellipsis from '../../components/ui/Ellipsis'

import type { CreateProduct, ProductOptions } from '@shop/shared'

import styles from './PageAdminAddProduct.module.css'

function parsePriceInOre(value: string): number | null {
  const normalized = value.trim().replace(',', '.')

  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) {
    return null
  }

  const [whole, fraction = ''] = normalized.split('.')
  const price = Number(`${whole}${fraction.padEnd(2, '0')}`)

  return Number.isSafeInteger(price) ? price : null
}

function formatPriceInput(value: string): string {
  const normalized = value.trim().replace(',', '.')

  if (!/^\d+(?:\.\d+)?$/.test(normalized)) return value

  const [wholePart, fraction = ''] = normalized.split('.')
  let whole = BigInt(wholePart)
  let cents = Number((fraction + '00').slice(0, 2))

  if (fraction[2] && fraction[2] >= '5') cents += 1

  if (cents === 100) {
    whole += 1n
    cents = 0
  }

  const priceInOre = Number(whole) * 100 + cents

  if (!Number.isSafeInteger(priceInOre)) return value

  return `${whole},${String(cents).padStart(2, '0')}`
}

export default function PageAdminAddProduct() {
  const navigate = useNavigate()

  const [product, setProduct] = useState<CreateProduct>({
    name: '',
    brand_name: '',
    description: '',
    details: [],
    img_url: '',
    stock: null,
    price: 0,
    purchase_type: 'webshop',
    category_ids: []
  })

  const [productOptions, setProductOptions] = useState<ProductOptions | null>(
    null
  )

  const [loading, setLoading] = useState(true)
  const [loadingError, setLoadingError] = useState<string | null>(null)

  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [priceInput, setPriceInput] = useState('0,00')

  const [indexWarning, setIndexWarning] = useState<string | null>(null)

  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const [createdProductId, setCreatedProductId] = useState<number | null>(null)

  useEffect(() => {
    const fetchProductOptions = async () => {
      try {
        setLoading(true)
        setLoadingError(null)

        const response = await getProductOptions()
        setProductOptions(response.data)
      } catch (error) {
        setLoadingError(getApiErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }

    fetchProductOptions()
  }, [])

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target

    if (name === 'price') {
      setPriceInput(value)
      return
    }

    setProduct((currentProduct) => {
      switch (name) {
        case 'details':
          return {
            ...currentProduct,
            details: value.split('\n')
          }

        case 'stock':
          return {
            ...currentProduct,
            stock: value === '' ? null : Number(value)
          }

        default:
          return {
            ...currentProduct,
            [name]: value
          }
      }
    })
  }

  const handleCategoriesChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const categoryIds = Array.from(event.target.selectedOptions).map((option) =>
      Number(option.value)
    )

    setProduct((currentProduct) => ({
      ...currentProduct,
      category_ids: categoryIds
    }))
  }

  const handlePurchaseTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setProduct((currentProduct) => ({
      ...currentProduct,
      purchase_type: event.target.value as CreateProduct['purchase_type']
    }))
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedImage(event.target.files?.[0] ?? null)
    setImageError(null)
  }

  const handleSave = async () => {
    if (creating || createdProductId !== null) return

    const price = parsePriceInOre(priceInput)

    if (price === null) {
      setCreateError(
        'Priset måste vara ett icke-negativt belopp med högst två decimaler.'
      )
      return
    }

    setCreating(true)
    setCreateError(null)
    setImageError(null)
    setIndexWarning(null)

    try {
      const newProduct: CreateProduct = {
        ...product,
        price,
        details: product.details
          .map((item) => item.trim())
          .filter((item) => item !== '')
      }

      const response = await createProduct(newProduct)
      const createdProduct = response.data.product

      setCreatedProductId(createdProduct.id)

      if (!response.data.searchIndexUpdated) {
        setIndexWarning(
          'Produkten skapades, men sökindexet kunde inte uppdateras.'
        )
      }

      if (selectedImage) {
        try {
          await uploadProductImage(createdProduct.id, selectedImage)
        } catch (error) {
          setImageError(
            `${getApiErrorMessage(error)} Produkten har skapats utan bild. Du kan lägga till bilden genom att redigera produkten.`
          )
          return
        }
      }

      if (response.data.searchIndexUpdated) {
        navigate('/admin/products')
      }
    } catch (error) {
      setCreateError(getApiErrorMessage(error))
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="addProduct">
      <h1 className="headingSize1">Lägg till produkt</h1>

      {loading && <Spinner />}

      {!loading && loadingError && (
        <Error message={loadingError} />
      )}

      {!loading && !loadingError && !productOptions && (
        <Error message="Produktalternativ kunde inte hittas." />
      )}

      {!loading && !loadingError && productOptions && (
        <>
          <div className="inputGroup">
            <label htmlFor="product-name">Produktnamn</label>
            <input
              type="text"
              id="product-name"
              name="name"
              value={product.name}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label htmlFor="product-brand">Varumärke</label>
            <input
              type="text"
              id="product-brand"
              name="brand_name"
              value={product.brand_name}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label htmlFor="product-description">Produktbeskrivning</label>
            <textarea
              id="product-description"
              name="description"
              value={product.description}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label htmlFor="product-details">
              Detaljer (separera med radbrytning)
            </label>
            <textarea
              id="product-details"
              name="details"
              value={product.details.join('\n')}
              onChange={handleChange}
            />
          </div>

          <div className={`inputGroup ${styles.productImageInputGroup}`}>
            <label htmlFor="product-image">Produktbild</label>

            <input
              type="file"
              id="product-image"
              accept="image/jpeg,image/png"
              onChange={handleImageChange}
              disabled={creating || createdProductId !== null}
            />

            {imageError && <Error message={imageError} />}
          </div>

          <div className="inputGroup">
            <label htmlFor="product-price">Pris i kr (inkl. moms)</label>
            <input
              type="text"
              inputMode="decimal"
              id="product-price"
              name="price"
              step="0.01"
              value={priceInput}
              onChange={handleChange}
              onBlur={() => setPriceInput((value) => formatPriceInput(value))}
            />
          </div>

          <div className="inputGroup">
            <label htmlFor="product-stock">Lagersaldo</label>
            <input
              type="number"
              id="product-stock"
              name="stock"
              value={product.stock ?? ''}
              onChange={handleChange}
              min={0}
            />
          </div>

          <div className="inputGroup">
            <label htmlFor="product-categories">Kategorier</label>
            <select
              id="product-categories"
              multiple
              value={product.category_ids.map(String)}
              onChange={handleCategoriesChange}
            >
              {productOptions.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="inputGroup">
            <label htmlFor="product-purchase-type">Försäljningstyp</label>
            <select
              id="product-purchase-type"
              value={product.purchase_type}
              onChange={handlePurchaseTypeChange}
            >
              {productOptions.purchase_types.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {createError && <Error message={createError} />}
          {indexWarning && <Error message={indexWarning} />}

          <div className="buttonGroup">
            <button
              type="button"
              onClick={handleSave}
              disabled={creating || createdProductId !== null}
              className="add"
            >
              {creating ? (
                <span>Skapar produkt<Ellipsis /></span>
              ) : createdProductId !== null ? (
                'Produkt skapad'
              ) : (
                'Skapa produkt'
              )}
            </button>
          </div>

          <BackLink to="/admin/products" label="Tillbaka till produktlistan" />
        </>
      )}
    </div>
  )
}
