import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts } from '../../api/productApi'
import { importSupplierProducts } from '../../api/supplierApi'
import categoriesToString from '../../utilities/categoriesToString'
import formatPrice from '../../utilities/formatPrice'
import getApiErrorMessage from '../../utilities/apiError'

import type { Product } from '@shop/shared'
import type { CatalogFormat, ImportReport } from '../../api/supplierApi'

import styles from './PageAdminProducts.module.css'

export default function PageAdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState<boolean>(true)
  const [productsLoadError, setProductsLoadError] = useState<string | null>(null)


  const [importLoading, setImportLoading] = useState<CatalogFormat | null>(null)
  const [importLoadError, setImportLoadError] = useState<string | null>(null)
  const [importReport, setImportReport] = useState<ImportReport | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    async function loadProducts() {
      try {
        const products = await fetchProducts()
        setProducts(products)
      } catch (error) {
        setProductsLoadError(getApiErrorMessage(error))
      } finally {
        setProductsLoading(false)
      }
    }

    void loadProducts()
  }, [])

  async function handleImport(format: CatalogFormat) {
    setImportLoading(format)
    setImportLoadError(null)
    setImportReport(null)

    try {
      const response = await importSupplierProducts(format)
      setImportReport(response.data)
    } catch (error) {
      setImportLoadError(getApiErrorMessage(error))
      setImportLoading(null)
      return
    }

    // The import is already complete, using try/catch to reload the products list, and display any errors that occur during the reload.
    try {
      const products = await fetchProducts()
      setProducts(products)
      setProductsLoadError(null)
    } catch (error) {
      setProductsLoadError(getApiErrorMessage(error))
    } finally {
      setImportLoading(null)
    }
  }

  return (
    <>
      <h1 className="headingSize1">Produkter</h1>

      <section className={styles.importSection}>
        <h2 className="headingSize4">Importera produkter från leverantör</h2>

        <div className="buttonGroup">
          <button
            type="button"
            onClick={() => handleImport('csv')}
            disabled={importLoading !== null}
          >
            {importLoading === 'csv' ? 'Importerar CSV...' : 'Importera CSV'}
          </button>

          <button
            type="button"
            onClick={() => handleImport('xml')}
            disabled={importLoading !== null}
          >
            {importLoading === 'xml' ? 'Importerar XML...' : 'Importera XML'}
          </button>
        </div>

        {importLoadError && <p className="errorMessage">{importLoadError}</p>}

        {importReport && (
          <div role="status">
            <p className={styles.importStatusDone}>Importen är klar</p>
            <ul className={styles.importReport}>
              <li>
                <span>Nya produkter</span>
                <span>{importReport.created}</span>
              </li>
              <li>
                <span>Uppdaterade produkter</span>
                <span>{importReport.updated}</span>
              </li>
              <li>
                <span>Överhoppade produkter</span>
                <span>{importReport.skippedCount}</span>
              </li>
            </ul>

            {importReport.skipped.length > 0 && (
              <ul className={styles.skippedList}>
                <li className={styles.skippedListHeader}>
                  <span>Art.nr</span>
                  <span>Fel</span>
                </li>
                {importReport.skipped.map((product, index) => (
                  <li key={`${product.sku ?? 'unknown'}-${index}`}>
                    <span>{product.sku ?? 'Okänt artikelnummer'}</span>
                    <span>{product.reason}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      {productsLoading ? (
        <p>Laddar produkter...</p>
      ) : productsLoadError ? (
        <p className="errorMessage">{productsLoadError}</p>
      ) : products.length === 0 ? (
        <p>Inga produkter hittades.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Art.nr</th>
              <th>Namn</th>
              <th>Kategori</th>
              <th>Pris</th>
              <th>Lagersaldo</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="clickable-row"
                onClick={() => navigate(`/admin/product/${product.id}`)}
              >
                <td>{product.sku ?? '–'}</td>
                <td>{product.name}</td>
                <td>{categoriesToString(product.categories)}</td>
                <td>{formatPrice(Number(product.price))}</td>
                <td>{product.stock === null ? 'Okänt' : `${product.stock} st`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        type="button"
        onClick={() => navigate('/admin/product/add')}
        className="add"
      >
        Lägg till produkt
      </button>
    </>
  )
}

async function fetchProducts(): Promise<Product[]> {
  const response = await getProducts()
  return response.data.products
}
