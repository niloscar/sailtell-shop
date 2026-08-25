import { useEffect, useState } from 'react'
import { getProductOptions, createProduct } from '../../api/productApi'
import type { CreateProduct, ProductOptions } from '../../types/productTypes'

export default function PageAdminAddProduct() {
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

  useEffect(() => {
    const fetchProductOptions = async () => {
      try {
        const response = await getProductOptions()
        setProductOptions(response.data)
      } catch (error) {
        console.error('Kunde inte hämta produktalternativ:', error)
      }
    }

    fetchProductOptions()
  }, [])

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target

    setProduct(currentProduct => {
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
    const categoryIds = Array.from(event.target.selectedOptions)
      .map(option => Number(option.value))

    setProduct(currentProduct => ({
      ...currentProduct,
      category_ids: categoryIds
    }))
  }

  const handlePurchaseTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setProduct(currentProduct => ({
      ...currentProduct,
      purchase_type: event.target.value as CreateProduct['purchase_type']
    }))
  }

  const handleSave = async () => {
    try {
      const newProduct = {
        ...product,
        details: product.details
          .map(item => item.trim())
          .filter(item => item !== '')
      }
      console.log('Skickar produktdata:', newProduct)
      const response = await createProduct(newProduct)

      console.log('Produkt skapad:', response.data)
    } catch (error) {
      console.error('Kunde inte skapa produkten:', error)
    }
  }

  return (
    <div>
      <h1 className="heading-size-1">Lägg till produkt</h1>

      <div className="input-group">
        <label htmlFor="product-name">Produktnamn</label>
        <input type="text" id="product-name" name="name" value={product.name} onChange={handleChange} />
      </div>

      <div className="input-group">
        <label htmlFor="product-brand">Varumärke</label>
        <input type="text" id="product-brand" name="brand_name" value={product.brand_name} onChange={handleChange} />
      </div>

      <div className="input-group">
        <label htmlFor="product-description">Produktbeskrivning</label>
        <textarea id="product-description" name="description" value={product.description} onChange={handleChange} />
      </div>

      <div className="input-group">
        <label htmlFor="product-details">Detaljer (separera med radbrytning)</label>
        <textarea id="product-details" name="details" value={product.details.join('\n')} onChange={handleChange} />
      </div>

      <div className="input-group">
        <label htmlFor="product-image">Produktbild, URL</label>
        <input type="text" id="product-image" name="img_url" value={product.img_url} onChange={handleChange} />
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
          {productOptions?.categories.map(category => (
            <option key={category.id} value={category.id}>
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
          {productOptions?.purchase_types.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={handleSave}
      >
        Skapa produkt
      </button>
    </div>
  )
}