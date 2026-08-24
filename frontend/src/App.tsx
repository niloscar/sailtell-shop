import { Routes, Route } from 'react-router-dom'

import LayoutPublic from './layouts/LayoutPublic'
import LayoutAdmin from './layouts/LayoutAdmin'

import PageStart from './pages/public/PageStart'
import PageProducts from './pages/public/PageProducts'
import PageSingleProduct from './pages/public/PageSingleProduct'
import PageCart from './pages/public/PageCart'
import PageCheckout from './pages/public/PageCheckout'
import PageAbout from './pages/public/PageAbout'

import PageAdmin from './pages/admin/PageStart'
import PageSingleOrder from './pages/admin/PageSingleOrder'

import './App.css'

function App() {
  return (
    <>
      <Routes>
        <Route element={<LayoutPublic />} >
          <Route path='/' element={<PageStart />} />
          <Route path='/products' element={<PageProducts />} />
          <Route path='/products/:categorySlug' element={<PageProducts />} />
          <Route path='/product/:id' element={<PageSingleProduct />} />
          <Route path='/cart' element={<PageCart />} />
          <Route path='/checkout' element={<PageCheckout />} />
          <Route path='/about' element={<PageAbout />} />
        </Route>
        <Route element={<LayoutAdmin />} >
          <Route path='/admin' element={<PageAdmin />} />
          <Route path='/admin/order/:id' element={<PageSingleOrder />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
