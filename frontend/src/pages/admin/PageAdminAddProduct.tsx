import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getProductOptions, createProduct } from '../../api/productApi'
import type { CreateProduct, ProductOptions } from '../../types/productTypes'
import { ArrowLeftIcon } from '@phosphor-icons/react'

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

  const [productOptions, setProductOptions] = useState<ProductOptions | null>(null)

  const [loading, setLoading] = useState(true)
  const [loadingError, setLoadingError] = useState<string | null>(null)

  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProductOptions = async () => {
      try {
        setLoading(true)
        setLoadingError(null)

        const response = await getProductOptions()
        setProductOptions(response.data)
      } catch (error) {
        setLoadingError(
          error instanceof Error
            ? error.message
            : 'Kunde inte hämta produktalternativ.'
        )
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
    const categoryIds = Array
      .from(event.target.selectedOptions)
      .map((option) => Number(option.value))

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
    setCreating(true)
    setCreateError(null)

    try {
      const newProduct: CreateProduct = {
        ...product,
        details: product.details
          .map((item) => item.trim())
          .filter((item) => item !== '')
      }

      await createProduct(newProduct)

      navigate('/products')
    } catch (error) {
      console.error('Kunde inte skapa produkten:', error)

      setCreateError(
        error instanceof Error
          ? error.message
          : 'Kunde inte skapa produkten.'
      )
    } finally {
      setCreating(false)
    }
  }

  if (loading) return <p>Laddar produktalternativ...</p>
  if (loadingError) return <p className="error-message">{loadingError}</p>
  if (!productOptions) return <p>Produktalternativ kunde inte hittas.</p>

  return (
    <div className="page-admin-add-product">
      <h1 className="heading-size-1">Lägg till produkt</h1>

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
        <label htmlFor="product-description">Produktbeskrivning</label>
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
        <label htmlFor="product-price">Pris i kr (inkl. moms)</label>
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
        <select
          id="product-categories"
          multiple
          value={product.category_ids.map(String)}
          onChange={handleCategoriesChange}
        >
          {productOptions.categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="product-purchase-type">Försäljningstyp</label>
        <select
          id="product-purchase-type"
          value={product.purchase_type}
          onChange={handlePurchaseTypeChange}
        >
          {productOptions.purchase_types.map((option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}
        </select>
      </div>

      {createError && (
        <p className="error-message">{createError}</p>
      )}

      <div className="button-group">
        <button
          type="button"
          onClick={handleSave}
          disabled={creating}
          className="add"
        >
          {creating
            ? 'Skapar produkt...'
            : 'Skapa produkt'}
        </button>
      </div>

      <Link to="/admin/products" className="link-back">
        <ArrowLeftIcon size={20} />
        Tillbaka till produktlistan
      </Link>
    </div>
  )
}