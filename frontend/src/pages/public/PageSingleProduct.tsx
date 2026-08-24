import ProductDetails from '../../components/ProductDetails'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@phosphor-icons/react'

function PageSingleProduct() {

  return (
    <div>
      <ProductDetails />
      <Link 
        to="/"
        className="link-back"
      >
        <ArrowLeftIcon size={20} />
        <span>Tillbaka</span>
      </Link>
    </div>
  )
}

export default PageSingleProduct