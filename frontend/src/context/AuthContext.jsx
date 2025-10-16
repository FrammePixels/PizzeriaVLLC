import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

axios.defaults.baseURL = "http://localhost:4019"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [cartShop, setCartShop] = useState([])
  const [discount, setDiscount] = useState(0)
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [offers, setOffers] = useState([])

  // 🧩 Login / Logout
  const login = async (username, password) => {
    try {
      const { data } = await axios.post('/auth/login', { username, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.role)
      setUser({ username, role: data.role })
      return { success: true }
    } catch (err) {
      console.error(err)
      return { success: false, error: err.response?.data?.message || err.message }
    }
  }

  const logout = () => {
    setUser(null)
    setOffers([])
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('cartShop')
  }

  // 🧩 Inicializar sesión y cargar datos
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const userResponse = await fetch('/api/user', {
            headers: { 'Authorization': `Bearer ${token}` }
          })

          if (userResponse.ok) {
            const userData = await userResponse.json()
            setUser(userData)

            const offersResponse = await fetch('/api/user/offers', {
              headers: { 'Authorization': `Bearer ${token}` }
            })

            if (offersResponse.ok) {
              const offersData = await offersResponse.json()
              setOffers(offersData)
            }
          }
        } catch (error) {
          console.error('Error loading data:', error)
          setUser(null)
          setOffers([])
        }
      }
      setLoading(false)
    }
    initializeAuth()
  }, [])

  // 🛒 Persistencia del carrito
  useEffect(() => {
    const storedCart = localStorage.getItem("cartShop")
    if (storedCart) setCartShop(JSON.parse(storedCart))
  }, [])

  useEffect(() => {
    localStorage.setItem("cartShop", JSON.stringify(cartShop))
  }, [cartShop])

  // 🛒 Carrito de compras (funciones de tu CartProvider)
  const addToShop = (item) => {
    if (!item.id) {
      console.error('❌ El producto debe tener un ID')
      return
    }

    const indexProduct = cartShop.findIndex(prod => prod.id === item.id)
    if (indexProduct === -1) {
      setCartShop([...cartShop, item])
    } else {
      const inCart = cartShop[indexProduct].quantity
      cartShop[indexProduct].quantity = inCart + item.quantity
      setCartShop([...cartShop])
    }
  }

  const removeProduct = (id) => {
    setCartShop(cartShop.filter(item => item.id !== id))
  }

  const deleteCart = () => {
    setCartShop([])
  }

  const PriceFinal = () =>
    cartShop.reduce((acum, prod) => acum + prod.costo * prod.quantity, 0)

  const TotalsProducts = () => {
    const totalQuantity = cartShop.reduce((acc, prod) => acc + prod.quantity, 0)
    return totalQuantity.toLocaleString('es-ES', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
  }

  const bgCounts = () =>
    cartShop.reduce((acum, prod) => acum + prod.quantity, 0)

  // 💰 Descuento
  const priceAfterDiscount = () => PriceFinal() * (1 - discount / 100)
  const applyDiscount = (percent) => setDiscount(percent)

  // ⭐ Favoritos
  const addToFavorites = (item) => {
    if (!favorites.find(fav => fav.id === item.id)) setFavorites([...favorites, item])
  }

  const removeFromFavorites = (itemId) => {
    setFavorites(favorites.filter(fav => fav.id !== itemId))
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      cartShop,
      addToShop,
      removeProduct,
      deleteCart,
      PriceFinal,
      TotalsProducts,
      bgCounts,
      applyDiscount,
      priceAfterDiscount,
      addToFavorites,
      removeFromFavorites,
      favorites,
      offers,
      addOffer: (newOffer) => setOffers(prev => [...prev, newOffer]),
      updateOffer: (updatedOffer) => setOffers(prev => prev.map(o => o.id === updatedOffer.id ? updatedOffer : o)),
      discount,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
export default AuthContext
