import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  getProduct,
  getProductOptions,
  updateProduct,
  uploadProductImage,
  deleteProduct
} from '../../api/productApi'
import getApiErrorMessage from '../../utilities/apiError'
import BackLink from '../../components/BackLink'
import Spinner from '../../components/ui/Spinner'
import Ellipsis from '../../components/ui/Ellipsis'
import Error from '../../components/ui/Error'


import type { Product, ProductOptions, UpdateProduct } from '@shop/shared'

import styles from './PageAdminUpdateProduct.module.css'

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

type LoadingState = {
  loading: boolean
  error: string | null
}

type PageLoadingState = {
  product: LoadingState
  productOptions: LoadingState
  action: LoadingState
}

type LoadKey = keyof PageLoadingState

export default function PageAdminUpdateProduct() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [product, setProduct] = useState<Product | null>(null)
  const [originalProduct, setOriginalProduct] = useState<Product | null>(null)
  const [priceInput, setPriceInput] = useState('')
  const [productOptions, setProductOptions] = useState<ProductOptions | null>(null)

  const [loadingState, setLoadingState] = useState<PageLoadingState>({
    product: {
      loading: true,
      error: null
    },
    productOptions: {
      loading: true,
      error: null
    },
    action: {
      loading: false,
      error: null
    }
  })

  const [indexWarning, setIndexWarning] = useState<string | null>(null)

  const [imageError, setImageError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const imageInputRef = useRef<HTMLInputElement>(null)

  const updateLoadingState = (key: LoadKey, updates: Partial<LoadingState>) => {
    setLoadingState((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...updates
      }
    }))
  }

  useEffect(() => {
    const fetchProductOptions = async () => {
      updateLoadingState('productOptions', {
        loading: true,
        error: null
      })

      try {
        const response = await getProductOptions()

        setProductOptions(response.data)
      } catch (error) {
        updateLoadingState('productOptions', {
          error: getApiErrorMessage(error)
        })
      } finally {
        updateLoadingState('productOptions', {
          loading: false
        })
      }
    }

    fetchProductOptions()
  }, [])

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return

      updateLoadingState('product', {
        loading: true,
        error: null
      })

      try {
        const response = await getProduct(Number(id))

        setProduct(response.data)
        setOriginalProduct(structuredClone(response.data))
        setPriceInput((response.data.price / 100).toFixed(2).replace('.', ','))
      } catch (error) {
        updateLoadingState('product', { error: getApiErrorMessage(error) })
      } finally {
        updateLoadingState('product', { loading: false })
      }
    }

    fetchProduct()
  }, [id])

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target

    if (name === 'price') {
      setPriceInput(value)
      return
    }

    setProduct((currentProduct) => {
      if (!currentProduct) return currentProduct

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
    if (!productOptions) return

    const selectedIds = Array.from(event.target.selectedOptions).map((option) =>
      Number(option.value)
    )

    setProduct((currentProduct) => {
      if (!currentProduct) return currentProduct

      return {
        ...currentProduct,
        categories: productOptions.categories.filter((category) =>
          selectedIds.includes(category.id)
        )
      }
    })
  }

  const handlePurchaseTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const purchaseType = event.target.value as Product['purchase_type']

    setProduct((currentProduct) => {
      if (!currentProduct) return currentProduct

      return {
        ...currentProduct,
        purchase_type: purchaseType
      }
    })
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedImage(event.target.files?.[0] ?? null)
    setImageError(null)
  }

  const handleDelete = async () => {
    if (!product || !id) return

    const confirmed = window.confirm(
      `Vill du verkligen radera "${product.name}"?`
    )

    if (!confirmed) return

    updateLoadingState('action', {
      loading: true,
      error: null
    })
    setIndexWarning(null)

    try {
      const response = await deleteProduct(Number(id))

      if (!response.data.searchIndexUpdated) {
        window.alert(
          'Produkten raderades, men kunde inte tas bort från sökindexet.'
        )
      }

      navigate('/admin/products')
    } catch (error) {
      updateLoadingState('action', { error: getApiErrorMessage(error) })
    } finally {
      updateLoadingState('action', {
        loading: false
      })
    }
  }

  const handleReset = () => {
    if (!originalProduct) return

    setProduct(structuredClone(originalProduct))
    setPriceInput((originalProduct.price / 100).toFixed(2).replace('.', ','))
    setSelectedImage(null)
    imageInputRef.current!.value = ''
    setImageError(null)

    updateLoadingState('action', { error: null })
  }

  const handleSave = async () => {
    if (!product || !id) return

    const price = parsePriceInOre(priceInput)

    if (price === null) {
      updateLoadingState('action', {
        error:
          'Priset måste vara ett icke-negativt belopp med högst två decimaler.'
      })
      return
    }

    updateLoadingState('action', {
      loading: true,
      error: null
    })

    setImageError(null)
    setIndexWarning(null)

    try {
      const updatedProduct: UpdateProduct = {
        name: product.name,
        brand_name: product.brand_name ?? '',
        description: product.description ?? '',
        details: product.details ?? [],
        stock: product.stock,
        price,
        purchase_type: product.purchase_type,
        category_ids: product.categories.map((category) => category.id)
      }

      const response = await updateProduct(Number(id), updatedProduct)
      const savedProduct = response.data.product

      setProduct(savedProduct)
      setOriginalProduct(structuredClone(savedProduct))
      setPriceInput((savedProduct.price / 100).toFixed(2).replace('.', ','))

      if (!response.data.searchIndexUpdated) {
        setIndexWarning('Produkten uppdaterades, men sökindexet kunde inte uppdateras.')
      }

      if (selectedImage) {
        try {
          const { img_url, img_path } = await uploadProductImage(Number(id), selectedImage)

          setProduct((current) => current ? { ...current, img_url, img_path } : current )
          setOriginalProduct((current) => current ? { ...current, img_url, img_path } : current )
          setSelectedImage(null)
          if (imageInputRef.current) imageInputRef.current.value = ''
        } catch (error) {
          setImageError(getApiErrorMessage(error))
        }
      }
    } catch (error) {
      updateLoadingState('action', { error: getApiErrorMessage(error) })
    } finally {
      updateLoadingState('action', { loading: false })
    }
  }

  if (loadingState.product.loading) return <Spinner />
  if (loadingState.product.error) return <Error message={loadingState.product.error} />
  if (!product) return <Error message="Produkten kunde inte hittas." />

  return (
    <div className="updateProduct">
      <h1 className="headingSize1">Redigera produkt</h1>

      {loadingState.productOptions.error && (
        <Error message={loadingState.productOptions.error} />
      )}

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
          value={product.brand_name ?? ''}
          onChange={handleChange}
        />
      </div>

      <div className="inputGroup">
        <label htmlFor="product-description">Produktbeskrivning</label>
        <textarea
          id="product-description"
          name="description"
          value={product.description ?? ''}
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
          value={product.details?.join('\n') ?? ''}
          onChange={handleChange}
        />
      </div>

      <div className={`inputGroup ${styles.productImageInputGroup}`}>
        <label htmlFor="product-image">Produktbild</label>

        {product.img_url && (
          <img
            src={product.img_url}
            alt={product.name}
            className={styles.productImagePreview}
          />
        )}

        <input
          ref={imageInputRef}
          type="file"
          id="product-image"
          accept="image/jpeg,image/png"
          onChange={handleImageChange}
          disabled={loadingState.action.loading}
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

        {loadingState.productOptions.loading ? (
          <Spinner />
        ) : (
          <select
            id="product-categories"
            multiple
            value={product.categories.map((category) => String(category.id))}
            onChange={handleCategoriesChange}
          >
            {productOptions?.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="inputGroup">
        <label htmlFor="product-purchase-type">Försäljningstyp</label>

        {loadingState.productOptions.loading ? (
          <Spinner />
        ) : (
          <select
            id="product-purchase-type"
            value={product.purchase_type}
            onChange={handlePurchaseTypeChange}
          >
            {productOptions?.purchase_types.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}
      </div>

      {loadingState.action.error && (
        <Error message={loadingState.action.error} />
      )}
      {indexWarning && <Error message={indexWarning} />}

      <div className="buttonGroup">
        <button
          className="delete"
          type="button"
          onClick={handleDelete}
          disabled={loadingState.action.loading}
        >
          Radera produkt
        </button>

        <button
          type="button"
          onClick={handleReset}
          disabled={loadingState.action.loading}
        >
          Återställ
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={loadingState.action.loading}
          className="save"
        >
          {loadingState.action.loading ? (
            <span>Sparar<Ellipsis /></span>
          ) : (
            'Spara ändringar'
          )}
        </button>
      </div>

      <BackLink to="/admin/products" label="Tillbaka till produktlistan" />
    </div>
  )
}
