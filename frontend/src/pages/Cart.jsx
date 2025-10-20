import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ShoppingCart, Trash2, ChevronRight, Zap, Lock, AlertCircle } from 'lucide-react'

export default function Cart() {
  const { cartShop, deleteCart, PriceFinal, priceAfterDiscount, applyDiscount } = useAuth()

  const [activeCode, setActiveCode] = useState(null)
  const [glowIndex, setGlowIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIndex(prev => (prev + 1) % (cartShop.length || 1))
    }, 2000)
    return () => clearInterval(interval)
  }, [cartShop.length])

  const handleDiscount = (code, percent) => {
    setActiveCode(code)
    applyDiscount(percent)
  }

  const handleRemoveDiscount = () => {
    setActiveCode(null)
    applyDiscount(0)
  }

  const subtotal = PriceFinal()
  const total = priceAfterDiscount()

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Fondo animado */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          animation: 'grid-flow 20s linear infinite',
        }}
      />

      {/* Luces difusas */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" />
      <div
        className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse"
        style={{ animationDelay: '1s' }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse"
        style={{ animationDelay: '2s' }}
      />

      {/* Contenido */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 md:py-12">
        <div className="mb-3">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-12 bg-gradient-to-b from-cyan-500 via-purple-500 via-pink-500 to-orange-500" />
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                SHOPPING <span className="ml-3">CART</span>
              </h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Productos */}
          <div className="lg:col-span-8 space-y-3">
            {cartShop.length === 0 ? (
              <div className="bg-gray-900 bg-opacity-50 backdrop-blur-sm border border-gray-800 rounded-lg p-16 text-center">
                <ShoppingCart className="w-20 h-20 mx-auto mb-4 text-gray-700" />
                <h3 className="text-2xl font-bold text-gray-400 mb-2">Your cart is empty</h3>
                <p className="text-gray-600">Start adding some amazing products!</p>
              </div>
            ) : (
              cartShop.map((item, idx) => {
                const price = Number(item.price) || 0
                const quantity = Number(item.quantity) || 1
                const totalItem = price * quantity

                return (
                  <div
                    key={item.id}
                    className="group bg-gray-900 bg-opacity-50 backdrop-blur-sm border border-gray-800 hover:border-gray-700 rounded-lg overflow-hidden transition-all duration-300"
                    style={{
                      animation: `slide-in-right 0.5s ease-out ${idx * 0.1}s both`,
                      ...(glowIndex === idx && { animation: 'neon-pulse 2s ease-in-out' }),
                    }}
                  >
                    <div className="flex flex-col sm:flex-row gap-4 p-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-full sm:w-28 h-28 bg-gray-800 rounded-lg overflow-hidden relative">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingCart className="w-12 h-12 text-gray-700" />
                            </div>
                          )}
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-black font-black text-sm">
                          {quantity}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1 truncate">{item.name}</h3>
                            <p className="text-xs text-gray-500">ID: {String(item.id).padStart(8, '0')}</p>
                          </div>
                          <button
                            onClick={() => deleteCart(item.id)}
                            className="flex-shrink-0 w-9 h-9 rounded-lg bg-gray-800 hover:bg-red-600 border border-gray-700 hover:border-red-500 flex items-center justify-center transition-all group"
                          >
                            <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-white" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs text-gray-500">Unit:</span>
                            <span className="text-sm text-cyan-400 font-semibold">${price.toFixed(2)}</span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs text-gray-500">Total:</span>
                            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                              ${totalItem.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="h-1 bg-gradient-to-r from-cyan-500 via-purple-500 via-pink-500 to-orange-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                )
              })
            )}

            {cartShop.length > 0 && (
              <button
                onClick={deleteCart}
                className="w-full bg-gray-900 bg-opacity-50 backdrop-blur-sm border border-red-900 hover:border-red-500 rounded-lg py-3 text-red-400 hover:text-red-300 font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear all items
              </button>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-gray-900 bg-opacity-50 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-cyan-500 via-purple-500 via-pink-500 to-orange-500" />
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-cyan-400" />
                  Order Summary
                </h3>

                <div className="space-y-3 mb-5">
                  {activeCode && (
                    <div className="flex justify-between text-purple-400">
                      <span>Discount</span>
                      <span className="font-semibold">-${(subtotal - total).toFixed(2)}</span>
                    </div>
                  )}

                  <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-bold text-white">Total</span>
                    <span className="text-white font-bold text-3xl">${total.toFixed(2)}</span>
                  </div>
                </div>

                {cartShop.length === 0 ? (
                  <div className="w-full py-4 rounded-lg font-bold text-white bg-gray-800 opacity-40 cursor-not-allowed flex items-center justify-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Cart is empty
                  </div>
                ) : (
                  <Link
                    to="/Checkout"
                    className="w-full py-4 rounded-lg font-bold text-white transition-all relative overflow-hidden group bg-gradient-to-r from-cyan-500 via-purple-500 via-pink-500 to-orange-500 hover:shadow-xl hover:shadow-purple-500/50 flex items-center justify-center gap-2"
                    style={{ animation: 'float 3s ease-in-out infinite' }}
                  >
                    Proceed to Checkout
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-600">
                  <Zap className="w-3 h-3" />
                  <span>Secure & encrypted payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
