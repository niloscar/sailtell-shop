import BackLink from '../../components/BackLink'

export default function PageConfirm() {
  return (
    <>
      <h1 className="headingSize1">Tack för ditt köp!</h1>
      <p>
        Vi har tagit emot din beställning och skickar den så snart som möjligt.
      </p>
      <p>Du kommer att få en bekräftelse via e-post.</p>

      <BackLink to="/" label="Tillbaka till startsidan" />
    </>
  )
}
