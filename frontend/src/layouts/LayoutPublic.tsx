import { Outlet } from 'react-router-dom'
import CartProvider from '../contexts/CartProvider'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import MainNav from '../components/navigation/MainNav'

export default function LayoutPublic() {
  return (
    <>
      <Header />
      <div className="navTrack">
        <CartProvider>
          <MainNav />
          <main className="pageMain">
            <Outlet />
          </main>
        </CartProvider>
      </div>
      <Footer />
    </>
  )
}
