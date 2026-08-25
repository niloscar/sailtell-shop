import ProductList from "../../components/ProductList"

function PageStart() {
  return (
    <>
      <h1 className="heading-size-1">SailTell</h1>
      <p>Appen SailTell flyttar över information som du annars hade fått från fasta och kostsamma navigationsinstrument till din smartklocka, så att du har all nödvändig information tillgänglig på din handled.</p>
      <div className="featured-container">
        <ProductList category="featured" title={false} />
      </div>
    </>
  )
}

export default PageStart