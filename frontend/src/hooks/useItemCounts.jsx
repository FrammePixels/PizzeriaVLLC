import { useState } from 'react'
import { toast } from 'react-toastify'

export const useItemCount = () => {
  const [count, setCount] = useState(0)

  const Increment = () => {
    setCount(count + 1)
  }

  const Decrement = () => {
    if (count > 0) setCount(count - 1)
  }

  const addToShop = () => {
    if (count > 0) {
      toast.success(`Has agregado ${count} producto/s al carrito`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
    } else {
      toast.error('No has seleccionado ningun producto', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
    }
  }

  return { count, Increment, Decrement, addToShop }
}
