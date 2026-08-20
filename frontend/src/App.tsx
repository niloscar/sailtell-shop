import { Routes, Route } from 'react-router-dom'
import './App.css'
import PageStart from './pages/PageStart'
import PageSingleProduct from './pages/PageSingleProduct'
import PageAdmin from './pages/PageAdmin'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<PageStart />} />
        <Route path='/product/:id' element={<PageSingleProduct />} />
        <Route path='/admin' element={<PageAdmin />} />
      </Routes>
    </>
  )
}

export default App
