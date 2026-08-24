import ProductList from "../../components/ProductList"
import { useParams } from "react-router-dom"

function PageProducts() {
  const { categorySlug } = useParams<{ categorySlug: string }>()

  return (
    <>
      <ProductList category={categorySlug} />
    </>
  )
}

export default PageProducts