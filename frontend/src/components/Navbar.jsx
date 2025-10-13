import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, Menu, X, ShoppingCart, Heart, Gamepad2, Cpu, Headphones, Monitor, Zap } from "lucide-react"
import { AiOutlineDashboard, AiOutlineLogout, AiOutlineSetting, AiOutlineLogin, AiOutlineUserAdd, AiOutlineShoppingCart } from "react-icons/ai"
import { IoPeopleOutline } from "react-icons/io5"
import { useAuth } from "../context/AuthContext"

export default function GamerNavbar() {
  const [search, setSearch] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  // Carrito simulado (puedes conectarlo con tu contexto de carrito)
  const cartItemsCount = 3

  // Roles que pueden acceder al dashboard
  const canAccessDashboard =
    user?.role === "Owner" ||
    user?.role === "Co-Ceo" ||
    user?.role === "Admin" ||
    user?.role === "Moderator"

  // Función para realizar búsqueda
  const doSearch = () => {
    const q = search.trim()
    if (q.length > 0) navigate(`/products?search=${encodeURIComponent(q)}`)
    else navigate(`/products`)
    setIsDropdownOpen(false)
    setIsMobileMenuOpen(false)
  }

  // Ejecutar búsqueda al presionar Enter
  const onKeyDown = (e) => {
    if (e.key === "Enter") doSearch()
  }

  // Logout
  const handleLogout = async () => {
    await logout()
    navigate("/login")
    setIsDropdownOpen(false)
    setIsMobileMenuOpen(false)
  }

  const goToDashboard = () => {
    if (canAccessDashboard) {
      navigate("/dashboard")
      setIsDropdownOpen(false)
      setIsMobileMenuOpen(false)
    }
  }

  const goToConfiguration = () => {
    navigate("/configuration")
    setIsDropdownOpen(false)
    setIsMobileMenuOpen(false)
  }

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

  const categories = [
    { icon: <Gamepad2 size={18} />, name: "Consolas", link: "/category/consolas" },
    { icon: <Cpu size={18} />, name: "PC Gaming", link: "/category/pc-gaming" },
    { icon: <Monitor size={18} />, name: "Monitores", link: "/category/monitores" },
    { icon: <Headphones size={18} />, name: "Periféricos", link: "/category/perifericos" },
  ]

  return (
    <header className="w-full sticky top-0 z-50 backdrop-blur-md bg-gradient-to-r from-gray-950/98 via-purple-950/98 to-gray-950/98 shadow-2xl border-b border-purple-500/30">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white text-center py-2 text-sm font-semibold tracking-wide">
        <Zap size={16} className="inline mr-2 animate-pulse" />
        ¡OFERTAS FLASH! Hasta 50% OFF en productos seleccionados
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <Gamepad2 size={36} className="text-purple-500 group-hover:text-pink-500 transition-colors duration-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
              <div className="absolute inset-0 bg-purple-500/20 blur-xl group-hover:bg-pink-500/20 transition-colors duration-300"></div>
            </div>
            <span className="text-3xl m-2 font-black tracking-tighter bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-200">
              GAMERZONE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="text-gray-200 hover:text-purple-400 transition-colors duration-200 font-bold text-sm tracking-wide relative group">
              INICIO
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-200"></span>
            </Link>
            
            <div 
              className="relative"
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
            >
              <button className="text-gray-200 hover:text-purple-400 transition-colors duration-200 font-bold text-sm tracking-wide relative group flex items-center gap-1">
                CATEGORÍAS
                <span className="text-xs">▼</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-200"></span>
              </button>
              
              {showCategories && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-purple-500/30 py-2 z-50">
                  {categories.map((cat, idx) => (
                    <Link
                      key={idx}
                      to={cat.link}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-purple-900/30 hover:text-purple-400 transition-all duration-150"
                    >
                      <span className="text-purple-500">{cat.icon}</span>
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/ofertas" className="text-gray-200 hover:text-purple-400 transition-colors duration-200 font-bold text-sm tracking-wide relative group">
              OFERTAS
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-200"></span>
            </Link>
            
            <Link to="/novedades" className="text-gray-200 hover:text-purple-400 transition-colors duration-200 font-bold text-sm tracking-wide relative group">
              NOVEDADES
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-200"></span>
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center">
            <div className="relative flex items-center bg-gray-900/60 rounded-xl border border-purple-500/30 hover:border-purple-500/60 transition-all duration-200 overflow-hidden backdrop-blur-sm shadow-lg shadow-purple-500/10">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Buscar productos..."
                className="px-4 py-2.5 text-gray-200 text-sm bg-transparent focus:outline-none w-48 lg:w-64 placeholder-gray-500"
              />
              <button
                onClick={doSearch}
                className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg shadow-purple-500/30"
              >
                <Search size={18} className="text-white" />
              </button>
            </div>
          </div>

          {/* Icons & User Menu Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-xl bg-gray-900/60 hover:bg-purple-900/30 border border-purple-500/30 hover:border-purple-500/60 transition-all duration-200 group"
            >
              <Heart size={22} className="text-gray-200 group-hover:text-pink-400 transition-colors" />
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl bg-gray-900/60 hover:bg-purple-900/30 border border-purple-500/30 hover:border-purple-500/60 transition-all duration-200 group"
            >
              <ShoppingCart size={22} className="text-gray-200 group-hover:text-purple-400 transition-colors" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg shadow-pink-500/50 animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              {user ? (
                <>
                  <button
                    onClick={toggleDropdown}
                    className="p-2.5 rounded-xl bg-gray-900/60 hover:bg-purple-900/30 border border-purple-500/30 hover:border-purple-500/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-950"
                  >
                    <IoPeopleOutline size={22} className="text-gray-200" />
                  </button>

                  {isDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                      <div className="absolute right-0 mt-3 w-56 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-purple-500/30 py-2 z-50">
                        <div className="px-4 py-3 border-b border-purple-500/30">
                          <p className="text-sm font-semibold text-gray-200">{user.name || user.email}</p>
                          <p className="text-xs text-purple-400 mt-1">{user.role || "Usuario"}</p>
                        </div>

                        {canAccessDashboard && (
                          <button
                            onClick={goToDashboard}
                            className="flex items-center w-full px-4 py-3 text-sm text-gray-200 hover:bg-purple-900/30 transition-colors duration-150"
                          >
                            <AiOutlineDashboard className="mr-3 h-5 w-5 text-purple-500" />
                            Dashboard
                          </button>
                        )}

                        <Link
                          to="/orders"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center w-full px-4 py-3 text-sm text-gray-200 hover:bg-purple-900/30 transition-colors duration-150"
                        >
                          <AiOutlineShoppingCart className="mr-3 h-5 w-5 text-purple-500" />
                          Mis Pedidos
                        </Link>

                        <button
                          onClick={goToConfiguration}
                          className="flex items-center w-full px-4 py-3 text-sm text-gray-200 hover:bg-purple-900/30 transition-colors duration-150"
                        >
                          <AiOutlineSetting className="mr-3 h-5 w-5 text-purple-500" />
                          Configuración
                        </button>

                        <div className="border-t border-purple-500/30 my-2"></div>

                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:bg-purple-900/30 transition-colors duration-150"
                        >
                          <AiOutlineLogout className="mr-3 h-5 w-5 text-red-400" />
                          Cerrar Sesión
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/30"
                  >
                    <AiOutlineLogin className="h-5 w-5" />
                    Ingresar
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-900/60 hover:bg-purple-900/30 text-gray-200 font-semibold text-sm rounded-xl transition-all duration-200 border border-purple-500/30 hover:border-purple-500/60"
                  >
                    <AiOutlineUserAdd className="h-5 w-5 text-purple-400" />
                    Registro
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-gray-200 hover:bg-purple-900/30 focus:outline-none border border-purple-500/30"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3 animate-in slide-in-from-top">
            {/* Search bar */}
            <div className="relative flex items-center bg-gray-900/60 rounded-xl border border-purple-500/30 overflow-hidden mt-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Buscar productos..."
                className="px-4 py-2.5 text-gray-200 text-sm bg-transparent focus:outline-none w-full placeholder-gray-500"
              />
              <button onClick={doSearch} className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5">
                <Search size={18} className="text-white" />
              </button>
            </div>

            {/* Mobile Icons Row */}
            <div className="flex gap-2 px-2">
              <Link 
                to="/wishlist" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-900/60 rounded-xl border border-purple-500/30 text-gray-200 hover:bg-purple-900/30"
              >
                <Heart size={18} />
                <span className="text-sm font-semibold">Favoritos</span>
              </Link>
              <Link 
                to="/cart" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-900/60 rounded-xl border border-purple-500/30 text-gray-200 hover:bg-purple-900/30 relative"
              >
                <ShoppingCart size={18} />
                <span className="text-sm font-semibold">Carrito</span>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col space-y-2">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-200 hover:text-purple-400 transition-colors px-3 py-2.5 rounded-xl hover:bg-purple-900/30 font-bold">
                INICIO
              </Link>
              
              <div className="px-3 py-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
                Categorías
              </div>
              {categories.map((cat, idx) => (
                <Link 
                  key={idx}
                  to={cat.link} 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="flex items-center gap-3 text-gray-200 hover:text-purple-400 transition-colors px-3 py-2.5 rounded-xl hover:bg-purple-900/30"
                >
                  <span className="text-purple-500">{cat.icon}</span>
                  {cat.name}
                </Link>
              ))}
              
              <Link to="/ofertas" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-200 hover:text-purple-400 transition-colors px-3 py-2.5 rounded-xl hover:bg-purple-900/30 font-bold">
                OFERTAS
              </Link>
              <Link to="/novedades" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-200 hover:text-purple-400 transition-colors px-3 py-2.5 rounded-xl hover:bg-purple-900/30 font-bold">
                NOVEDADES
              </Link>
            </nav>

            {/* Auth Buttons / User Info */}
            <div className="border-t border-purple-500/30 pt-3 space-y-2">
              {user ? (
                <>
                  <div className="px-3 py-3 bg-purple-900/20 rounded-xl border border-purple-500/30">
                    <p className="text-sm font-semibold text-gray-200">{user.name || user.email}</p>
                    <p className="text-xs text-purple-400 mt-1">{user.role || "Usuario"}</p>
                  </div>

                  {canAccessDashboard && (
                    <button onClick={goToDashboard} className="flex items-center w-full px-3 py-2.5 text-sm text-gray-200 hover:bg-purple-900/30 rounded-xl">
                      <AiOutlineDashboard className="mr-3 h-5 w-5 text-purple-500" />
                      Dashboard
                    </button>
                  )}

                  <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center w-full px-3 py-2.5 text-sm text-gray-200 hover:bg-purple-900/30 rounded-xl">
                    <AiOutlineShoppingCart className="mr-3 h-5 w-5 text-purple-500" />
                    Mis Pedidos
                  </Link>

                  <button onClick={goToConfiguration} className="flex items-center w-full px-3 py-2.5 text-sm text-gray-200 hover:bg-purple-900/30 rounded-xl">
                    <AiOutlineSetting className="mr-3 h-5 w-5 text-purple-500" />
                    Configuración
                  </button>

                  <button onClick={handleLogout} className="flex items-center w-full px-3 py-2.5 text-sm text-red-400 hover:bg-purple-900/30 rounded-xl">
                    <AiOutlineLogout className="mr-3 h-5 w-5 text-red-400" />
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-3">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/30">
                    <AiOutlineLogin className="h-5 w-5" />
                    Ingresar
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 py-2.5 bg-gray-900/60 hover:bg-purple-900/30 text-gray-200 font-semibold text-sm rounded-xl border border-purple-500/30 transition-all duration-200">
                    <AiOutlineUserAdd className="h-5 w-5 text-purple-400" />
                    Registro
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}