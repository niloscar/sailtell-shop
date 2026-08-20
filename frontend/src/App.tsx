import { Routes, Route } from 'react-router-dom'
import './App.css'
import PageStart from './pages/public/PageStart'
import PageSingleProduct from './pages/public/PageSingleProduct'
import PageAdmin from './pages/admin/PageStart'
import PageSingleOrder from './pages/admin/PageSingleOrder'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<PageStart />} />
        <Route path='/product/:id' element={<PageSingleProduct />} />
        <Route path='/admin' element={<PageAdmin />} />
        <Route path='/admin/order/:id' element={<PageSingleOrder />} />
      </Routes>
    </>
  )
}

export default App
