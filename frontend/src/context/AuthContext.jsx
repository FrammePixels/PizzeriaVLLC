import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

axios.defaults.baseURL = "http://localhost:5000"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [cartShop, setCartShop] = useState([])
  const [discount, setDiscount] = useState(0)
  const [favorites, setFavorites] = useState([])

  const login = async (username, password) => {
    try {
      const payload = { username, password }
      const { data } = await axios.post('/auth/login', payload)
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
    localStorage.removeItem('token')
    localStorage.removeItem('role')
  }

  const createAnime = async ({ titulo, descripcion, imagen }) => {
    try {
      const formData = new FormData()
      formData.append("Titulo", titulo)
      formData.append("Descripcion", descripcion)
      if (imagen) formData.append("Imagen", imagen)
      const token = localStorage.getItem("token")
      const { data } = await axios.post("/animes", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      })
      return data
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return
    axios.get("/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const role = res.data.role || localStorage.getItem("role")
        setUser({ ...res.data.user, role })
      })
      .catch(() => {
        localStorage.removeItem("token")
        localStorage.removeItem("role")
        setUser(null)
      })
  }, [])

  // funciones del carrito
  const addToShop = (item) => {
    const iproductitem = cartShop.findIndex((prod) => prod.id === item.id)
    if (iproductitem !== -1) {
      const newCart = [...cartShop]
      newCart[iproductitem].quantity += item.quantity || 1
      setCartShop(newCart)
    } else {
      setCartShop([...cartShop, { ...item, quantity: item.quantity || 1 }])
    }
  }

  const PriceFinal = () => {
    return cartShop.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const TotalProducts = () => {
    const totalQuantity = cartShop.reduce((total, item) => total + item.quantity, 0)
    const formattedQuantity = totalQuantity < 10 ? `0${totalQuantity}` : totalQuantity
    return formattedQuantity
  }

  const CountShop = () => {
    return cartShop.reduce((acumular, ProductoObjeto) => (acumular += ProductoObjeto.quantity), 0)
  }

  const removeItem = (id) => {
    const newCart = cartShop.filter((item) => item.id !== id)
    setCartShop(newCart)
  }

  const deleteItemCart = () => {
    setCartShop([])
  }

  const syncCart = async () => {
    const token = localStorage.getItem("token")
    if (!token) return
    await axios.post("/cart/sync", { cart: cartShop }, {
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  // funciones de descuento
  const applyDiscount = (percent) => {
    setDiscount(percent)
  }

  const priceAfterDiscount = () => {
    return PriceFinal() * (1 - discount / 100)
  }

  // funciones de favoritos
  const addToFavorites = (item) => {
    if (!favorites.find(fav => fav.id === item.id)) {
      setFavorites([...favorites, item])
    }
  }

  const removeFromFavorites = (itemId) => {
    setFavorites(favorites.filter(fav => fav.id !== itemId))
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      createAnime,
      addToShop,
      cartShop,
      TotalProducts,
      PriceFinal,
      CountShop,
      removeItem,
      deleteItemCart,
      syncCart,
      applyDiscount,
      priceAfterDiscount,
      addToFavorites,
      removeFromFavorites
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

export default AuthContext
