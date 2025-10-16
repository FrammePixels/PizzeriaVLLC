import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaShoppingCart } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const CardWidgets = () => {
  const { cartShop, bgCounts } = useAuth()
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    setItemCount(bgCounts())
  }, [cartShop])

  return (
    <Link to="/cart" className="relative flex items-center p-2">
      <FaShoppingCart className="text-cyan-400 hover:text-cyan-300 transition-colors" size={20} />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-cyan-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.7)]">
          {itemCount}
        </span>
      )}
    </Link>
  )
}

export default CardWidgets
