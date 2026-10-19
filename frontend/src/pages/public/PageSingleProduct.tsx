import ProductDetails from '../../components/ProductDetails'
import BackLink from '../../components/BackLink'

function PageSingleProduct() {

  return (
    <div>
      <ProductDetails />
      <BackLink to="/" label="Tillbaka" />
    </div>
  )
}

export default PageSingleProduct
