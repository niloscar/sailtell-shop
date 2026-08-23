import { Routes, Route } from 'react-router-dom'

import LayoutPublic from './layouts/LayoutPublic'
import LayoutAdmin from './layouts/LayoutAdmin'

import PageStart from './pages/public/PageStart'
import PageSingleProduct from './pages/public/PageSingleProduct'
import PageAdmin from './pages/admin/PageStart'
import PageSingleOrder from './pages/admin/PageSingleOrder'

import './App.css'

function App() {
  return (
    <>
      <Routes>
        <Route element={<LayoutPublic />} >
          <Route path='/' element={<PageStart />} />
          <Route path='/product/:id' element={<PageSingleProduct />} />
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
