import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, Menu, X, ShoppingCart, Heart, Gamepad2, Cpu, Headphones, Monitor, Zap, Flame, Trophy, Crown, CircleUserRound } from "lucide-react"
import { AiOutlineDashboard, AiOutlineLogout, AiOutlineSetting, AiOutlineLogin, AiOutlineUserAdd, AiOutlineShoppingCart } from "react-icons/ai"
import { IoPeopleOutline } from "react-icons/io5"
import { useAuth } from "../context/AuthContext"
import CartWidgets from "./CardWidgets"  
import MegaSale from "./MegaSale.jsx"

export default function GamerNavbar() {
  const [search, setSearch] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const canAccessDashboard =
    user?.role === "Owner" ||
    user?.role === "Co-Ceo" ||
    user?.role === "Admin" ||
    user?.role === "Moderator"

  const doSearch = () => {
    const q = search.trim()
    if (q.length > 0) navigate(`/products?search=${encodeURIComponent(q)}`)
    else navigate(`/products`)
    setIsDropdownOpen(false)
    setIsMobileMenuOpen(false)
  }

  const onKeyDown = (e) => {
    if (e.key === "Enter") doSearch()
  }

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

  const goToProfile = () => {
    navigate("/profile")
    setIsDropdownOpen(false)
    setIsMobileMenuOpen(false)
  }

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

  const categories = [
    { icon: <Gamepad2 size={20} />, name: "CONSOLES", link: "/category/consoles", color: "from-cyan-500 to-blue-500" },
    { icon: <Cpu size={20} />, name: "PC GAMING", link: "/category/pc-gaming", color: "from-green-500 to-emerald-500" },
    { icon: <Monitor size={20} />, name: "MONITORS", link: "/category/monitors", color: "from-purple-500 to-pink-500" },
   ]

  return (
    <header className="w-full sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-black/95 via-gray-900/95 to-black/95 shadow-xl border-b border-cyan-500/20">
      {/* Cyber Banner */}
      <MegaSale/>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group relative"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-lg transform group-hover:rotate-180 transition-transform duration-500">
                <Gamepad2 size={24} className="text-black" strokeWidth={3} />
              </div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter leading-none bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                NEXUS
              </span>
              <span className="text-[8px] font-bold tracking-[0.3em] text-cyan-500 uppercase">GAMING STORE</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-200 hover:text-cyan-400 transition-colors duration-200 font-medium text-sm tracking-wide relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-200"></span>
            </Link>
            
            <div 
              className="relative"
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
            >
              <button className="text-gray-200 hover:text-cyan-400 transition-colors duration-200 font-medium text-sm tracking-wide relative group flex items-center gap-1">
                Categories
                <span className="text-[8px] group-hover:rotate-180 transition-transform">▼</span>
              </button>
              
              {showCategories && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-black/95 backdrop-blur-xl rounded-xl border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)] z-50 overflow-hidden">
                  {categories.map((cat, idx) => (
                    <Link
                      key={idx}
                      to={cat.link}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-cyan-500/10 transition-all duration-150 border-b border-cyan-500/20 last:border-b-0"
                    >
                      <div className={`p-1.5 rounded bg-gradient-to-br ${cat.color} shadow`}>
                        {cat.icon}
                      </div>
                      <span className="font-medium">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              to="/Offers" 
              className="text-gray-200 hover:text-orange-400 transition-colors duration-200 font-medium text-sm tracking-wide relative group"
            >
              <Flame size={14} className="inline mr-1 animate-pulse" />
              Offers
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-400 group-hover:w-full transition-all duration-200"></span>
            </Link>
            
            <Link 
              to="/News" 
              className="text-gray-200 hover:text-purple-400 transition-colors duration-200 font-medium text-sm tracking-wide relative group"
            >
              <Crown size={14} className="inline mr-1" />
              News
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-200"></span>
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center">
            <div className="relative flex items-center bg-black/50 rounded-lg border border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-200 overflow-hidden backdrop-blur-sm">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Buscar..."
                className="px-4 py-2 text-cyan-400 text-sm bg-transparent focus:outline-none w-48 lg:w-64 placeholder-gray-500"
              />
              <button 
                onClick={doSearch} 
                className="bg-gradient-to-r from-cyan-500 to-purple-500 px-4 py-2 hover:from-cyan-600 hover:to-purple-600 transition-all duration-200 shadow-lg shadow-cyan-500/20"
              >
                <Search size={18} className="text-white" />
              </button>
            </div>
          </div>

          {/* User / Auth Menu Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Wishlist */}
            <Link to="/wishlist" className="p-2 rounded-full bg-black/50 hover:bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-200">
              <Heart size={20} className="text-gray-400 hover:text-pink-500 transition-colors" strokeWidth={2.5} />
            </Link>

            {/* Cart */}
            <div className="p-2 rounded-full bg-black/50 hover:bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-200">
              <CartWidgets />
            </div>

            {/* User Menu */}
            <div className="relative">
              {user ? (
                <>
                  <button 
                    onClick={toggleDropdown}
                    className="p-2 rounded-full bg-black/50 hover:bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    <CircleUserRound size={20} className="text-gray-400 hover:text-purple-400 transition-colors" />
                  </button>

                  {isDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsDropdownOpen(false)}
                      ></div>
                      <div className="absolute right-0 mt-3 w-56 bg-black/95 backdrop-blur-xl rounded-xl shadow-2xl border border-cyan-500/30 py-2 z-50">
                        <div className="px-4 py-3 border-b border-cyan-500/20">
                          <p className="text-sm font-semibold text-gray-200">{user.name || user.email}</p>
                          <p className="text-xs text-gray-400 mt-1">{user.role || "Usuario"}</p>
                        </div>
                        
                        <button 
                          onClick={goToProfile} 
                          className="flex items-center w-full px-4 py-3 text-sm text-gray-200 hover:bg-cyan-500/10 transition-colors duration-150"
                        >
                          <CircleUserRound className="mr-3 h-5 w-5 text-cyan-400" />
                          Mi Perfil
                        </button>
                        
                        {canAccessDashboard && (
                          <button 
                            onClick={goToDashboard} 
                            className="flex items-center w-full px-4 py-3 text-sm text-gray-200 hover:bg-cyan-500/10 transition-colors duration-150"
                          >
                            <AiOutlineDashboard className="mr-3 h-5 w-5 text-cyan-400" />
                            Dashboard
                          </button>
                        )}
                        
                        <button 
                          onClick={goToConfiguration} 
                          className="flex items-center w-full px-4 py-3 text-sm text-gray-200 hover:bg-cyan-500/10 transition-colors duration-150"
                        >
                          <AiOutlineSetting className="mr-3 h-5 w-5 text-cyan-400" />
                          Configuración
                        </button>

                        <div className="border-t border-cyan-500/20 my-2"></div>

                        <button 
                          onClick={handleLogout} 
                          className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors duration-150"
                        >
                          <AiOutlineLogout className="mr-3 h-5 w-5 text-red-400" />
                          Salir
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-gray-900 font-semibold text-sm rounded-lg transition-all duration-200"
                  >
                    <AiOutlineLogin className="h-5 w-5" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-cyan-500/10 text-gray-200 font-medium text-sm rounded-lg transition-all duration-200 border border-cyan-500/30"
                  >
                    <AiOutlineUserAdd className="h-5 w-5 text-cyan-400" />
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-200 hover:bg-cyan-500/10 focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3 animate-in slide-in-from-top">
            {/* Search bar */}
            <div className="relative flex items-center bg-black/50 rounded-lg border border-cyan-500/30 overflow-hidden mt-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Buscar..."
                className="px-4 py-2 text-cyan-400 text-sm bg-transparent focus:outline-none w-full placeholder-gray-500"
              />
              <button 
                onClick={doSearch} 
                className="bg-gradient-to-r from-cyan-500 to-purple-500 px-4 py-2"
              >
                <Search size={18} className="text-white" />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-200 hover:text-cyan-400 transition-colors px-3 py-2 rounded-lg hover:bg-cyan-500/10"
              >
                Home
              </Link>
              
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-cyan-400 mb-2">Categories</p>
                {categories.map((cat, idx) => (
                  <Link
                    key={idx}
                    to={cat.link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-sm text-gray-300 hover:text-white hover:bg-cyan-500/10 rounded-lg px-3 py-2 mb-1"
                  >
                    <div className={`p-1.5 rounded bg-gradient-to-br ${cat.color} shadow`}>
                      {cat.icon}
                    </div>
                    <span className="font-medium">{cat.name}</span>
                  </Link>
                ))}
              </div>
              
              <Link 
                to="/Offers" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-200 hover:text-orange-400 transition-colors px-3 py-2 rounded-lg hover:bg-orange-500/10 flex items-center gap-2"
              >
                <Flame size={14} className="animate-pulse" />
                Offers
              </Link>
              
              <Link 
                to="/News" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-200 hover:text-purple-400 transition-colors px-3 py-2 rounded-lg hover:bg-purple-500/10 flex items-center gap-2"
              >
                <Crown size={14} />
                News
              </Link>
            </nav>

            {/* Auth Buttons / User Info */}
            <div className="border-t border-cyan-500/20 pt-3 space-y-2">
              {user ? (
                <>
                  <div className="px-3 py-2 bg-cyan-500/10 rounded-lg">
                    <p className="text-sm font-semibold text-gray-200">{user.name || user.email}</p>
                    <p className="text-xs text-gray-400 mt-1">{user.role || "Usuario"}</p>
                  </div>

                  <button 
                    onClick={() => {
                      goToProfile();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-200 hover:bg-cyan-500/10 rounded-lg"
                  >
                    <CircleUserRound className="mr-3 h-5 w-5 text-cyan-400" />
                    Mi Perfil
                  </button>

                  {canAccessDashboard && (
                    <button 
                      onClick={() => {
                        goToDashboard();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-200 hover:bg-cyan-500/10 rounded-lg"
                    >
                      <AiOutlineDashboard className="mr-3 h-5 w-5 text-cyan-400" />
                      Dashboard
                    </button>
                  )}

                  <button 
                    onClick={() => {
                      goToConfiguration();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-200 hover:bg-cyan-500/10 rounded-lg"
                  >
                    <AiOutlineSetting className="mr-3 h-5 w-5 text-cyan-400" />
                    Configuración
                  </button>

                  <button 
                    onClick={handleLogout} 
                    className="flex items-center w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg"
                  >
                    <AiOutlineLogout className="mr-3 h-5 w-5 text-red-400" />
                    Salir
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-gray-900 font-semibold text-sm rounded-lg transition-all duration-200"
                  >
                    <AiOutlineLogin className="h-5 w-5" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-2 bg-black/50 hover:bg-cyan-500/10 text-gray-200 font-medium text-sm rounded-lg border border-cyan-500/30 transition-all duration-200"
                  >
                    <AiOutlineUserAdd className="h-5 w-5 text-cyan-400" />
                    Register
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