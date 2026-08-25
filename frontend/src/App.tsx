import { Routes, Route } from 'react-router-dom'

import LayoutPublic from './layouts/LayoutPublic'
import LayoutAdmin from './layouts/LayoutAdmin'

import PageStart from './pages/public/PageStart'
import PageProducts from './pages/public/PageProducts'
import PageSingleProduct from './pages/public/PageSingleProduct'
import PageCart from './pages/public/PageCart'
import PageCheckout from './pages/public/PageCheckout'
import PageAbout from './pages/public/PageAbout'

import PageAdmin from './pages/admin/PageAdminStart'
import PageAdminOrders from './pages/admin/PageAdminOrders'
import PageAdminSingleOrder from './pages/admin/PageAdminSingleOrder'
import PageAdminCustomers from './pages/admin/PageAdminCustomers'
import PageAdminProducts from './pages/admin/PageAdminProducts'
import PageAdminUpdateProduct from './pages/admin/PageAdminUpdateProduct'
import PageAdminAddProduct from './pages/admin/PageAdminAddProduct'


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
          <Route path='/admin/orders' element={<PageAdminOrders />} />
          <Route path='/admin/order/:id' element={<PageAdminSingleOrder />} />
          <Route path='/admin/customers' element={<PageAdminCustomers />} />
          <Route path='/admin/products' element={<PageAdminProducts />} />
          <Route path='/admin/product/:id' element={<PageAdminUpdateProduct />} />
          <Route path='/admin/product/add' element={<PageAdminAddProduct />} />
        </Route>
        <Route path='*' element={<p>404 - Sidan hittades inte</p>} />
      </Routes>
    </>
  )
}

export default App
