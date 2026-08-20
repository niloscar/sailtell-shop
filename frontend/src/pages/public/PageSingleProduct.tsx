import ProductDetails from '../../components/ProductDetails'
import { Link } from 'react-router-dom'

function PageSingleProduct() {

  return (
    <div>
      <h1>Produktinformation</h1>
      <ProductDetails />
      <Link to="/">Tillbaka till startsidan</Link>
    </div>
  )
}

export default PageSingleProduct