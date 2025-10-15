import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

axios.defaults.baseURL = "http://localhost:4019"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [cartShop, setCartShop] = useState([])
  const [discount, setDiscount] = useState(0)
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true) // ✅ Añadido
  const [offers, setOffers] = useState([]) // ✅ Añadido

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
    setOffers([]) // ✅ Limpiar offers al hacer logout
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

  // ✅ useEffect principal corregido
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Obtener datos del usuario
          const userResponse = await fetch('/api/user', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData);

            // Obtener offers del usuario
            const offersResponse = await fetch('/api/user/offers', {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (offersResponse.ok) {
              const offersData = await offersResponse.json();
              setOffers(offersData);
            }
          }
        } catch (error) {
          console.error('Error loading data:', error);
          // No hacer logout automáticamente, solo limpiar datos locales
          setUser(null);
          setOffers([]);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // ✅ Función para añadir ofertas
  const addOffer = (newOffer) => {
    setOffers(prev => [...prev, newOffer]);
  };

  // ✅ Función para actualizar ofertas
  const updateOffer = (updatedOffer) => {
    setOffers(prev => prev.map(offer => 
      offer.id === updatedOffer.id ? updatedOffer : offer
    ));
  };

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

  // Función corregida: cambiado 'cart' por 'cartShop'
  const bgCounts = () => {
    return cartShop.reduce((total, item) => total + item.quantity, 0);
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
      removeFromFavorites,
      favorites,
      bgCounts,
      // ✅ Añadidas las funciones de offers
      offers,
      addOffer,
      updateOffer,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

export default AuthContext