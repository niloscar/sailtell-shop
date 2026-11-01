import { Outlet } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import AdminNav from '../components/navigation/AdminNav'

export default function LayoutAdmin() {
  return (
    <>
      <Header admin />
      <div className="navTrack">
        <AdminNav />
        <main className="pageMain">
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  )
}
