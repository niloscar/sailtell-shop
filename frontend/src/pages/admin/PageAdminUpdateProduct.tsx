import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeftIcon } from '@phosphor-icons/react'

import {
  getProduct,
  getProductOptions,
  updateProduct,
  deleteProduct
} from '../../api/productApi'

import type {
  Product,
  ProductOptions,
  UpdateProduct
} from '../../types/productTypes'

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

  const updateLoadingState = (
    key: LoadKey,
    updates: Partial<LoadingState>
  ) => {
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
        console.error('Kunde inte hämta produktalternativ:', error)

        updateLoadingState('productOptions', {
          error: 'Kunde inte hämta produktalternativ.'
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
      } catch (error) {
        console.error('Kunde inte hämta produkt:', error)

        updateLoadingState('product', {
          error: 'Kunde inte hämta produkten.'
        })
      } finally {
        updateLoadingState('product', {
          loading: false
        })
      }
    }

    fetchProduct()
  }, [id])

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target

    setProduct((currentProduct) => {
      if (!currentProduct) return currentProduct

      switch (name) {
        case 'details':
          return {
            ...currentProduct,
            details: value.split('\n')
          }

        case 'price':
          return {
            ...currentProduct,
            price: Number(value)
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

    const selectedIds = Array
      .from(event.target.selectedOptions)
      .map((option) => Number(option.value))

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

    try {
      await deleteProduct(Number(id))

      navigate('/admin/products')
    } catch (error) {
      console.error('Kunde inte radera produkten:', error)

      updateLoadingState('action', {
        error: 'Kunde inte radera produkten.'
      })
    } finally {
      updateLoadingState('action', {
        loading: false
      })
    }
  }

  const handleReset = () => {
    if (!originalProduct) return

    setProduct(structuredClone(originalProduct))

    updateLoadingState('action', {
      error: null
    })
  }

  const handleSave = async () => {
    if (!product || !id) return

    updateLoadingState('action', {
      loading: true,
      error: null
    })

    try {
      const updatedProduct: UpdateProduct = {
        name: product.name,
        brand_name: product.brand_name,
        description: product.description,
        details: product.details,
        img_url: product.img_url,
        stock: product.stock,
        price: product.price,
        purchase_type: product.purchase_type,
        category_ids: product.categories.map((category) => category.id)
      }

      const response = await updateProduct(
        Number(id),
        updatedProduct
      )

      setProduct(response.data)
      setOriginalProduct(structuredClone(response.data))
    } catch (error) {
      console.error('Kunde inte uppdatera produkten:', error)

      updateLoadingState('action', {
        error: 'Kunde inte uppdatera produkten.'
      })
    } finally {
      updateLoadingState('action', {
        loading: false
      })
    }
  }

  if (loadingState.product.loading) return <p>Laddar produkt...</p>
  if (loadingState.product.error) return <p className="error-message">{loadingState.product.error}</p>
  if (!product) return <p className="error-message">Produkten kunde inte hittas.</p>

  return (
    <div className="page-admin-update-product">
      <h1 className="heading-size-1">Redigera produkt</h1>

      {loadingState.productOptions.error && (
        <p className="error-message">
          {loadingState.productOptions.error}
        </p>
      )}

      <div className="input-group">
        <label htmlFor="product-name">Produktnamn</label>
        <input
          type="text"
          id="product-name"
          name="name"
          value={product.name}
          onChange={handleChange}
        />
      </div>

      <div className="input-group">
        <label htmlFor="product-brand">Varumärke</label>
        <input
          type="text"
          id="product-brand"
          name="brand_name"
          value={product.brand_name}
          onChange={handleChange}
        />
      </div>

      <div className="input-group">
        <label htmlFor="product-description">
          Produktbeskrivning
        </label>
        <textarea
          id="product-description"
          name="description"
          value={product.description}
          onChange={handleChange}
        />
      </div>

      <div className="input-group">
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

      <div className="input-group">
        <label htmlFor="product-image">Produktbild, URL</label>
        <input
          type="text"
          id="product-image"
          name="img_url"
          value={product.img_url}
          onChange={handleChange}
        />
      </div>

      <div className="input-group">
        <label htmlFor="product-price">
          Pris i kr (inkl. moms)
        </label>
        <input
          type="number"
          id="product-price"
          name="price"
          value={product.price}
          onChange={handleChange}
        />
      </div>

      <div className="input-group">
        <label htmlFor="product-stock">Lagersaldo</label>
        <input
          type="number"
          id="product-stock"
          name="stock"
          value={product.stock ?? ''}
          onChange={handleChange}
        />
      </div>

      <div className="input-group">
        <label htmlFor="product-categories">Kategorier</label>

        {loadingState.productOptions.loading ? (
          <p>Laddar kategorier...</p>
        ) : (
          <select
            id="product-categories"
            multiple
            value={product.categories.map((category) =>
              String(category.id)
            )}
            onChange={handleCategoriesChange}
          >
            {productOptions?.categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="input-group">
        <label htmlFor="product-purchase-type">
          Försäljningstyp
        </label>

        {loadingState.productOptions.loading ? (
          <p>Laddar försäljningstyper...</p>
        ) : (
          <select
            id="product-purchase-type"
            value={product.purchase_type}
            onChange={handlePurchaseTypeChange}
          >
            {productOptions?.purchase_types.map((option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}
          </select>
        )}
      </div>

      {loadingState.action.error && (
        <p className="error-message">
          {loadingState.action.error}
        </p>
      )}

      <div className="button-group">
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
          {loadingState.action.loading
            ? 'Sparar...'
            : 'Spara ändringar'}
        </button>
      </div>

      <Link to="/admin/products" className="link-back">
        <ArrowLeftIcon size={20} />
        Tillbaka till produktlistan
      </Link>
    </div>
  )
}