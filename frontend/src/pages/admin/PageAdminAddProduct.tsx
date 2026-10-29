import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProductOptions, createProduct } from '../../api/productApi'
import getApiErrorMessage from '../../utilities/apiError'
import BackLink from '../../components/BackLink'
import Spinner from '../../components/ui/Spinner'

import type { CreateProduct, ProductOptions } from '@shop/shared'

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

  const [indexWarning, setIndexWarning] = useState<string | null>(null)

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

    setProduct((currentProduct) => {
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

  const handleSave = async () => {
    if (creating || indexWarning) return

    setCreating(true)
    setCreateError(null)
    setIndexWarning(null)

    try {
      const newProduct: CreateProduct = {
        ...product,
        details: product.details
          .map((item) => item.trim())
          .filter((item) => item !== '')
      }

      const response = await createProduct(newProduct)

      if (!response.data.searchIndexUpdated) {
        setIndexWarning(
          'Produkten skapades, men sökindexet kunde inte uppdateras.'
        )
        return
      }

      navigate('/admin/products')
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
        <p className="errorMessage">{loadingError}</p>
      )}

      {!loading && !loadingError && !productOptions && (
        <p>Produktalternativ kunde inte hittas.</p>
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

          <div className="inputGroup">
            <label htmlFor="product-image">Produktbild, URL</label>
            <input
              type="text"
              id="product-image"
              name="img_url"
              value={product.img_url}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label htmlFor="product-price">Pris i kr (inkl. moms)</label>
            <input
              type="number"
              id="product-price"
              name="price"
              value={product.price}
              onChange={handleChange}
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

          {createError && <p className="errorMessage">{createError}</p>}
          {indexWarning && <p className="errorMessage">{indexWarning}</p>}

          <div className="buttonGroup">
            <button
              type="button"
              onClick={handleSave}
              disabled={creating || !!indexWarning}
              className="add"
            >
              {creating
                ? 'Skapar produkt...'
                : indexWarning
                  ? 'Produkt skapad'
                  : 'Skapa produkt'}
            </button>
          </div>

          <BackLink to="/admin/products" label="Tillbaka till produktlistan" />
        </>
      )}
    </div>
  )
}
