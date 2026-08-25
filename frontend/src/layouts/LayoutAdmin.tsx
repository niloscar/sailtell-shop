import { Outlet } from "react-router-dom"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import AdminNav from "../components/navigation/AdminNav"

export default function LayoutAdmin() {
  return (
    <>
      <Header />
      <div className="admin-nav-track">
        <AdminNav />
        <main className="page-main">
            <Outlet />
        </main>
      </div>
      <Footer />
    </>
  )
}