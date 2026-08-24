import { Outlet } from "react-router-dom"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import MainNav from "../components/navigation/MainNav"

export default function LayoutAdmin() {
  return (
    <>
      <Header />
      <div className="main-nav-track">
        <MainNav />
        <main className="page-main">
            <Outlet />
        </main>
      </div>
      <Footer />
    </>
  )
}