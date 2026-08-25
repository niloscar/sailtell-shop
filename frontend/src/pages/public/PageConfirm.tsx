import { Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@phosphor-icons/react'
export default function PageConfirm() {
  return (
    <>
      <h1 className="heading-size-1">Tack för ditt köp!</h1>
      <p>Vi har tagit emot din beställning och skickar den så snart som möjligt.</p>
      <p>Du kommer att få en bekräftelse via e-post.</p>
      <Link 
        to="/"
        className="link-back"
      >
        <ArrowLeftIcon />
        Tillbaka till startsidan
      </Link>
    </>
  )
}