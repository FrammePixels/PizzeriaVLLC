import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, Menu, X, ShoppingCart, Heart, Gamepad2, Cpu, Headphones, Monitor, Zap, Flame, Trophy, Crown } from "lucide-react"
import { AiOutlineDashboard, AiOutlineLogout, AiOutlineSetting, AiOutlineLogin, AiOutlineUserAdd, AiOutlineShoppingCart } from "react-icons/ai"
import { IoPeopleOutline } from "react-icons/io5"
import { useAuth } from "../context/AuthContext"
import CartWidgets from "./CardWidgets"  
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

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

  const categories = [
    { icon: <Gamepad2 size={20} />, name: "CONSOLAS & JUEGOS", link: "/category/consolas", color: "from-cyan-500 to-blue-500" },
    { icon: <Cpu size={20} />, name: "PC GAMING", link: "/category/pc-gaming", color: "from-green-500 to-emerald-500" },
    { icon: <Monitor size={20} />, name: "MONITORES RGB", link: "/category/monitores", color: "from-purple-500 to-pink-500" },
    { icon: <Headphones size={20} />, name: "AUDIO GAMER", link: "/category/perifericos", color: "from-orange-500 to-red-500" },
  ]

  return (
    <>
      {/* Animated Background Effect */}
      <div className="fixed top-0 left-0 right-0 h-24 z-40 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 via-pink-500 to-orange-500 animate-pulse"></div>
      </div>

      <header className="w-full sticky top-0 z-50 backdrop-blur-xl bg-black/90 shadow-[0_0_30px_rgba(0,0,0,0.9)] border-b-2 border-cyan-500/50">
        {/* Cyber Banner */}
        <div className="relative bg-gradient-to-r from-black via-gray-900 to-black border-b border-cyan-500/30 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
          <div className="relative flex items-center justify-center py-2 text-center">
            <Flame size={18} className="text-orange-500 animate-bounce mr-2" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 font-black text-sm tracking-[0.2em] uppercase animate-pulse">
              ⚡ MEGA SALE ⚡ 70% OFF EN TODO EL SITIO
            </span>
            <Flame size={18} className="text-orange-500 animate-bounce ml-2" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* LOGO CYBERPUNK */}
            <Link to="/" className="flex items-center gap-2 group relative">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-lg transform group-hover:rotate-180 transition-transform duration-500">
                  <Gamepad2 size={28} className="text-black" strokeWidth={3} />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter leading-none bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:tracking-wider transition-all duration-300 [text-shadow:_0_0_20px_rgb(34_211_238_/_50%)]">
                  NEXUS
                </span>
                <span className="text-[10px] font-bold tracking-[0.3em] text-cyan-500 uppercase">GAMING STORE</span>
              </div>
            </Link>

            {/* Desktop Navigation - ESTILO CYBERPUNK */}
            <nav className="hidden lg:flex items-center space-x-1">
              <Link to="/" className="px-4 py-2 text-gray-300 hover:text-cyan-400 transition-all duration-200 font-black text-xs tracking-[0.15em] uppercase relative group border-2 border-transparent hover:border-cyan-500/30 bg-gradient-to-r hover:from-cyan-500/10 hover:to-transparent">
                <span className="relative z-10">Home</span>
                <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/5 transition-all"></div>
              </Link>
              
              <div 
                className="relative"
                onMouseEnter={() => setShowCategories(true)}
                onMouseLeave={() => setShowCategories(false)}
              >
                <button className="px-4 py-2 text-gray-300 hover:text-cyan-400 transition-all duration-200 font-black text-xs tracking-[0.15em] uppercase group border-2 border-transparent hover:border-cyan-500/30 bg-gradient-to-r hover:from-cyan-500/10 hover:to-transparent flex items-center gap-2">
                  <span className="relative z-10">Categories</span>
                  <span className="text-[8px] group-hover:rotate-180 transition-transform">▼</span>
                </button>
                
                {showCategories && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-black/95 backdrop-blur-xl rounded-none border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)] z-50 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5"></div>
                    {categories.map((cat, idx) => (
                      <Link
                        key={idx}
                        to={cat.link}
                        className="relative flex items-center gap-4 px-5 py-4 text-sm font-bold text-gray-300 hover:text-white transition-all duration-150 border-b border-cyan-500/20 last:border-b-0 group/item hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-transparent"
                      >
                        <div className={`p-2 rounded bg-gradient-to-br ${cat.color} shadow-lg group-hover/item:scale-110 transition-transform`}>
                          {cat.icon}
                        </div>
                        <span className="tracking-wider">{cat.name}</span>
                        <div className="ml-auto w-0 h-0.5 bg-cyan-500 group-hover/item:w-4 transition-all"></div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/Offers" className="px-4 py-2 text-gray-300 hover:text-orange-400 transition-all duration-200 font-black text-xs tracking-[0.15em] uppercase relative group border-2 border-transparent hover:border-orange-500/30 bg-gradient-to-r hover:from-orange-500/10 hover:to-transparent">
                <Flame size={14} className="inline mr-1 animate-pulse" />
                <span className="relative z-10">Offers</span>
              </Link>
              
              <Link to="/News" className="px-4 py-2 text-gray-300 hover:text-purple-400 transition-all duration-200 font-black text-xs tracking-[0.15em] uppercase relative group border-2 border-transparent hover:border-purple-500/30 bg-gradient-to-r hover:from-purple-500/10 hover:to-transparent">
                <Crown size={14} className="inline mr-1" />
                <span className="relative z-10">NEW</span>
              </Link>
            </nav>

            {/* Search Bar CYBERPUNK */}
            <div className="hidden md:flex items-center">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded opacity-30 group-hover:opacity-60 blur transition-opacity"></div>
                <div className="relative flex items-center bg-black border-2 border-cyan-500/50 group-hover:border-cyan-500 transition-all duration-200 overflow-hidden">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="BUSCAR..."
                    className="px-4 py-2.5 text-cyan-400 text-xs font-bold bg-transparent focus:outline-none w-48 lg:w-56 placeholder-gray-600 tracking-wider uppercase"
                  />
                  <button
                    onClick={doSearch}
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 px-4 py-2.5 hover:from-cyan-400 hover:to-purple-400 transition-all duration-200 relative overflow-hidden group/btn"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform"></div>
                    <Search size={18} className="text-black relative z-10" strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>

            {/* Icons & User Menu */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Wishlist */}
              <Link to="/wishlist" className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-red-500 rounded opacity-0 group-hover:opacity-30 blur transition-opacity"></div>
                <div className="relative p-2.5 bg-black border-2 border-gray-800 group-hover:border-pink-500 transition-all duration-200">
                  <Heart size={20} className="text-gray-500 group-hover:text-pink-500 transition-colors" strokeWidth={2.5} />
                </div>
              </Link>

              {/* Cart - Reemplazado por CartWidgets */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded opacity-0 group-hover:opacity-30 blur transition-opacity"></div>
                <div className="relative bg-black border-2 border-gray-800 group-hover:border-cyan-500 transition-all duration-200">
                  <CartWidgets />
                </div>
              </div>

              {/* User Menu */}
              <div className="relative">
                {user ? (
                  <>
                    <button onClick={toggleDropdown} className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded opacity-0 group-hover:opacity-30 blur transition-opacity"></div>
                      <div className="relative p-2.5 bg-black border-2 border-gray-800 group-hover:border-purple-500 transition-all duration-200">
                        <IoPeopleOutline size={20} className="text-gray-500 group-hover:text-purple-400 transition-colors" />
                      </div>
                    </button>

                    {isDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                        <div className="absolute right-0 mt-3 w-64 bg-black/98 backdrop-blur-xl border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)] z-50">
                          <div className="px-4 py-4 border-b-2 border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-transparent">
                            <p className="text-sm font-black text-cyan-400 tracking-wider uppercase">{user.name || user.email}</p>
                            <p className="text-xs text-gray-500 mt-1 font-bold tracking-widest uppercase">{user.role || "Usuario"}</p>
                          </div>

                          {canAccessDashboard && (
                            <button onClick={goToDashboard} className="flex items-center w-full px-4 py-3 text-sm font-bold text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-150 border-b border-gray-900">
                              <AiOutlineDashboard className="mr-3 h-5 w-5" />
                              DASHBOARD
                            </button>
                          )}

                          <Link to="/orders" onClick={() => setIsDropdownOpen(false)} className="flex items-center w-full px-4 py-3 text-sm font-bold text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all duration-150 border-b border-gray-900">
                            <AiOutlineShoppingCart className="mr-3 h-5 w-5" />
                            MIS PEDIDOS
                          </Link>

                          <button onClick={goToConfiguration} className="flex items-center w-full px-4 py-3 text-sm font-bold text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-150 border-b border-gray-900">
                            <AiOutlineSetting className="mr-3 h-5 w-5" />
                            CONFIG
                          </button>

                          <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-sm font-bold text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150">
                            <AiOutlineLogout className="mr-3 h-5 w-5" />
                            LOGOUT
                          </button>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link to="/login" className="relative group overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      <div className="relative flex items-center gap-2 px-5 py-2.5 border-2 border-cyan-500 group-hover:border-transparent text-cyan-400 group-hover:text-black font-black text-xs tracking-widest uppercase transition-colors">
                        <AiOutlineLogin className="h-4 w-4" />
                        LOGIN
                      </div>
                    </Link>
                    <Link to="/register" className="relative group overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      <div className="relative flex items-center gap-2 px-5 py-2.5 border-2 border-cyan-500 group-hover:border-transparent text-cyan-400 group-hover:text-black font-black text-xs tracking-widest uppercase transition-colors">
                        <AiOutlineUserAdd className="h-4 w-4" />
                        REGISTER
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 bg-black border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 transition-all">
              {isMobileMenuOpen ? <X size={24} strokeWidth={3} /> : <Menu size={24} strokeWidth={3} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-3 border-t-2 border-cyan-500/30 mt-2 pt-4">
              {/* Search bar */}
              <div className="relative">
                <div className="flex items-center bg-black border-2 border-cyan-500/50 overflow-hidden">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="BUSCAR..."
                    className="px-4 py-2.5 text-cyan-400 text-xs font-bold bg-transparent focus:outline-none w-full placeholder-gray-700 tracking-wider uppercase"
                  />
                  <button onClick={doSearch} className="bg-gradient-to-r from-cyan-500 to-purple-500 px-4 py-2.5">
                    <Search size={18} className="text-black" strokeWidth={3} />
                  </button>
                </div>
              </div>

              {/* Mobile Icons */}
              <div className="flex gap-2">
                <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-black border-2 border-pink-500/50 hover:border-pink-500 text-pink-400 hover:bg-pink-500/10 transition-all">
                  <Heart size={18} strokeWidth={2.5} />
                  <span className="text-xs font-black tracking-wider">FAVORITOS</span>
                </Link>
                <div className="flex-1 flex items-center justify-center gap-2 py-3 bg-black border-2 border-cyan-500/50 hover:border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 transition-all relative">
                  <CartWidgets />
                </div>
              </div>

              {/* Nav Links */}
              <nav className="flex flex-col space-y-1">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all px-4 py-3 font-black text-xs tracking-widest uppercase border-l-4 border-transparent hover:border-cyan-500">
                    Home
                </Link>
                
                <div className="px-4 py-2 text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] bg-cyan-500/5 border-l-4 border-cyan-500">
                  /// Categories
                </div>
                {categories.map((cat, idx) => (
                  <Link key={idx} to={cat.link} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500/10 transition-all px-4 py-3 border-l-4 border-transparent hover:border-cyan-500">
                    <span className={`p-1.5 rounded bg-gradient-to-br ${cat.color}`}>{cat.icon}</span>
                    <span className="font-bold text-xs tracking-wider">{cat.name}</span>
                  </Link>
                ))}
                
                <Link to="/Offers" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 transition-all px-4 py-3 font-black text-xs tracking-widest uppercase border-l-4 border-transparent hover:border-orange-500">
                  <Flame size={14} className="inline mr-2" />
                  Offers
                </Link>
                <Link to="/News" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all px-4 py-3 font-black text-xs tracking-widest uppercase border-l-4 border-transparent hover:border-purple-500">
                  <Crown size={14} className="inline mr-2" />
                  News
                </Link>
              </nav>

              {/* Auth Section */}
              <div className="border-t-2 border-cyan-500/30 pt-3 space-y-2">
                {user ? (
                  <>
                    <div className="px-4 py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-l-4 border-cyan-500">
                      <p className="text-sm font-black text-cyan-400 tracking-wider uppercase">{user.name || user.email}</p>
                      <p className="text-[10px] text-gray-500 mt-1 font-bold tracking-widest uppercase">{user.role || "Usuario"}</p>
                    </div>

                    {canAccessDashboard && (
                      <button onClick={goToDashboard} className="flex items-center w-full px-4 py-3 text-xs font-bold text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 uppercase tracking-wider border-l-4 border-transparent hover:border-cyan-500">
                        <AiOutlineDashboard className="mr-3 h-5 w-5" />
                        DASHBOARD
                      </button>
                    )}

                    <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center w-full px-4 py-3 text-xs font-bold text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 uppercase tracking-wider border-l-4 border-transparent hover:border-purple-500">
                      <AiOutlineShoppingCart className="mr-3 h-5 w-5" />
                      MIS PEDIDOS
                    </Link>

                    <button onClick={goToConfiguration} className="flex items-center w-full px-4 py-3 text-xs font-bold text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 uppercase tracking-wider border-l-4 border-transparent hover:border-cyan-500">
                      <AiOutlineSetting className="mr-3 h-5 w-5" />
                      CONFIG
                    </button>

                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-xs font-bold text-red-500 hover:text-red-400 hover:bg-red-500/10 uppercase tracking-wider border-l-4 border-transparent hover:border-red-500">
                      <AiOutlineLogout className="mr-3 h-5 w-5" />
                      LOGOUT
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 px-4">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 py-3 bg-black border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 font-black text-xs tracking-widest uppercase transition-all">
                      <AiOutlineLogin className="h-4 w-4" />
                      LOGIN
                    </Link>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 py-3 bg-black border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 font-black text-xs tracking-widest uppercase transition-all">
                      <AiOutlineUserAdd className="h-4 w-4" />
                      SIGN UP
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  )
}