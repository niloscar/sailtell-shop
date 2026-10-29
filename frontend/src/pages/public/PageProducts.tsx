import { useState } from 'react'
import ProductList from '../../components/ProductList'
import { useParams } from 'react-router-dom'

function PageProducts() {
  const { categorySlug } = useParams<{ categorySlug: string }>()
  const [categoryName, setCategoryName] = useState<string | null>(null)

  return (
    <>
      <h1 className="headingSize1">
        {categorySlug ? categoryName : 'Alla produkter'}
      </h1>

      <ProductList category={categorySlug} onCategoryLoad={setCategoryName} />
    </>
  )
}

export default PageProducts
