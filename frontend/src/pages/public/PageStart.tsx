import ProductList from '../../components/ProductList'

function PageStart() {
  return (
    <>
      <h1 className="headingSize1">SailTell</h1>
      <p>
        Appen SailTell flyttar över information som du annars hade fått från
        fasta och dyra navigationsinstrument till din smartklocka, så att du har
        all nödvändig information tillgänglig på din handled.
      </p>
      <div className="featuredContainer">
        <ProductList category="featured" />
      </div>
    </>
  )
}

export default PageStart
