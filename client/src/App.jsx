import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import { useAppContext } from './context/AppContext'
import Login from './components/Login'
import AllProducts from './pages/AllProducts'
import ProductCategory from './pages/ProductCategory'
import ProductDetails from './pages/ProductDetails'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import CategoryManagement from './pages/admin/CategoryManagement'
import ProductManagement from './pages/admin/ProductManagement'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import MyOrders from './pages/MyOrders'
import OrderConfirmation from './pages/OrderConfirmation'

const App = () => {

  const isSellerPath = useLocation().pathname.includes("seller");
  const isAdminPath = useLocation().pathname.includes("admin");
  const { showUserLogin } = useAppContext()

  return (
    <div>

      {(isSellerPath || isAdminPath) ? null : <Navbar />}
      {showUserLogin ? <Login /> : null}

      <Toaster />

      <div className={`${(isSellerPath || isAdminPath) ? "" : " px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<AllProducts />} />
          <Route path='/products/:category' element={<ProductCategory />} />
          <Route path='/products/:category/:id' element={<ProductDetails />} />

          {/* Admin Routes */}
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/admin/dashboard' element={<AdminDashboard />} />
          <Route path='/admin/categories' element={<CategoryManagement />} />
          <Route path='/admin/products' element={<ProductManagement />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/my-orders' element={<MyOrders />} />
          <Route path='/order-confirmation' element={<OrderConfirmation />} />
        </Routes>
      </div>
      {!(isSellerPath || isAdminPath) && <Footer />}
    </div>
  )
}

export default App
