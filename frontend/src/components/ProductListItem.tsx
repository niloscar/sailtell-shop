import { useNavigate } from 'react-router-dom'

import styles from './ProductListItem.module.css'

import type { ProductSummary } from '@shop/shared'

type ProductListItemData = Pick<
  ProductSummary,
  'id' | 'img_url' | 'name' | 'description'
>

export default function ProductListItem({ product }: { product: ProductListItemData }) {
  const navigate = useNavigate()


  return (
    <li
      key={product.id}
      className={`clickable ${styles.listItem}`}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {product.img_url ? (
        <img
          className={styles.image}
          src={product.img_url}
          alt={product.name}
        />
      ) : (
        <div className={styles.imagePlaceholder} aria-hidden="true" />
      )}
      <div className={styles.info}>
        <h2 className="headingSize2 product-title">{product.name}</h2>
        <p className={styles.description}>{product.description}</p>
      </div>
    </li>
  )
}
