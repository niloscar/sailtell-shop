import { Link } from 'react-router-dom'

export default function PageAbout() {
  return (
    <>
      <h1 className="heading-size-1">SailTell</h1>
            <p>Vi är ett företag som speciaiserat oss på att erbjuda innovativa och kostnadseffektiva lösningar för fritidsbåtar.</p>
            <p>Vår första produkt är SailTell, en app för smartklockor. Appen flyttar över information som du annars hade fått från fasta och kostsamma navigationsinstrument till din smartklocka, så att du har all nödvändig information tillgänglig på din handled.</p>
            <Link to="/product/9">Du kan läsa mer om appen här.</Link>
    </>
  )
}