import React, { useState } from 'react'
import { Flame, X } from "lucide-react"

const MegaSale = () => {
  const [visible, setVisible] = useState(true)
  const [closing, setClosing] = useState(false)

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => setVisible(false), 400)
  }

  if (!visible) return null

  return (
    <div
      className={`relative bg-gradient-to-r from-black via-gray-900 to-black border-b border-cyan-500/30 overflow-hidden transition-all duration-500 ${
        closing ? 'opacity-0 translate-y-[-10px]' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
      <div className="relative flex items-center justify-center py-2 text-center">
        <Flame size={18} className="text-orange-500 animate-bounce mr-2" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 font-black text-sm tracking-[0.2em] uppercase animate-pulse">
          MEGA SALE 70% OFF SITEWIDE
        </span>
        <Flame size={18} className="text-orange-500 animate-bounce ml-2" />
        <button
          onClick={handleClose}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}

export default MegaSale
