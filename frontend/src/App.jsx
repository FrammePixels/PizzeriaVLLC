import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Products from './pages/Products.jsx'
import SingleProduct from './pages/SingleProduct.jsx'
import Contact from './pages/Contact.jsx'
import Cart from './pages/Cart.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import Error404 from './pages/Error/Error404.jsx'

import { AuthProvider } from './context/AuthContext.jsx'

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/products' element={<Products />} />
          <Route path='/products/:id' element={<SingleProduct />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='*' element={<Error404 />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  )
}

export default App
