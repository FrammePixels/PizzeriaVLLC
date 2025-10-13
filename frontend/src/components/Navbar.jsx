import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { AiOutlineDashboard, AiOutlineLogout, AiOutlineSetting, AiOutlineLogin, AiOutlineUserAdd } from "react-icons/ai"; 
import { IoPeopleOutline } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";

export default function SubNavbar() {
  const [search, setSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const canAccessDashboard = 
    user?.role === "admin" || 
    user?.role === "moderador" || 
    user?.role === "admin" || 
    user?.role === "Moderador";

  const doSearch = () => {
    const q = search.trim();
    if (q.length > 0) navigate(`/posts?search=${encodeURIComponent(q)}`);
    else navigate(`/posts`);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") doSearch();
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    setIsDropdownOpen(false);
  };

  const goToDashboard = () => {
    if (canAccessDashboard) {
      navigate("/dashboard");
      setIsDropdownOpen(false);
    }
  };

  const goToConfiguration = () => {
    navigate("/configuration");
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="w-full sticky top-0 z-50 backdrop-blur-sm bg-gradient-to-r from-slate-900/95 via-gray-900/95 to-slate-900/95 shadow-xl border-b border-lime-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-3xl font-black tracking-tight bg-gradient-to-r from-lime-400 via-green-400 to-emerald-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
          >
            cheanime
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-200 hover:text-lime-400 transition-colors duration-200 font-medium text-sm tracking-wide relative group"
            >
              Inicio
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-lime-400 group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link 
              to="/movies" 
              className="text-gray-200 hover:text-lime-400 transition-colors duration-200 font-medium text-sm tracking-wide relative group"
            >
              Películas
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-lime-400 group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link 
              to="/tops" 
              className="text-gray-200 hover:text-lime-400 transition-colors duration-200 font-medium text-sm tracking-wide relative group"
            >
              Anime Tops
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-lime-400 group-hover:w-full transition-all duration-200"></span>
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center">
            <div className="relative flex items-center bg-slate-800/50 rounded-lg border border-slate-700 hover:border-lime-500/50 transition-all duration-200 overflow-hidden backdrop-blur-sm">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Buscar anime..."
                className="px-4 py-2 text-gray-200 text-sm bg-transparent focus:outline-none w-48 lg:w-64 placeholder-gray-500"
              />
              <button 
                onClick={doSearch} 
                className="bg-gradient-to-r from-lime-500 to-green-500 px-4 py-2 hover:from-lime-600 hover:to-green-600 transition-all duration-200 shadow-lg shadow-lime-500/20"
              >
                <Search size={18} className="text-white" />
              </button>
            </div>
          </div>

          {/* User / Auth Menu Desktop */}
          <div className="hidden md:block relative">
            {user ? (
              <>
                <button 
                  onClick={toggleDropdown}
                  className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-lime-500/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  <IoPeopleOutline size={22} className="text-gray-200" />
                </button>

                {isDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsDropdownOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-3 w-56 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 py-2 z-50 backdrop-blur-lg">
                      <div className="px-4 py-3 border-b border-slate-700">
                        <p className="text-sm font-semibold text-gray-200">{user.name || user.email}</p>
                        <p className="text-xs text-gray-400 mt-1">{user.role || "Usuario"}</p>
                      </div>
                      
                      {canAccessDashboard && (
                        <button 
                          onClick={goToDashboard} 
                          className="flex items-center w-full px-4 py-3 text-sm text-gray-200 hover:bg-slate-700/50 transition-colors duration-150"
                        >
                          <AiOutlineDashboard className="mr-3 h-5 w-5 text-lime-500" />
                          Dashboard
                        </button>
                      )}
                      
                      <button 
                        onClick={goToConfiguration} 
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-200 hover:bg-slate-700/50 transition-colors duration-150"
                      >
                        <AiOutlineSetting className="mr-3 h-5 w-5 text-lime-500" />
                        Configuración
                      </button>

                      <div className="border-t border-slate-700 my-2"></div>

                      <button 
                        onClick={handleLogout} 
                        className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:bg-slate-700/50 transition-colors duration-150"
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
                  className="flex items-center gap-2 px-4 py-2 bg-lime-500/90 hover:bg-lime-600 text-gray-900 font-semibold text-sm rounded-lg transition-all duration-200"
                >
                  <AiOutlineLogin className="h-5 w-5" />
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-gray-200 font-medium text-sm rounded-lg transition-all duration-200 border border-slate-600"
                >
                  <AiOutlineUserAdd className="h-5 w-5 text-lime-400" />
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-200 hover:bg-slate-800/50 focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3 animate-in slide-in-from-top">
            {/* Search bar */}
            <div className="relative flex items-center bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden mt-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Buscar anime..."
                className="px-4 py-2 text-gray-200 text-sm bg-transparent focus:outline-none w-full placeholder-gray-500"
              />
              <button 
                onClick={doSearch} 
                className="bg-gradient-to-r from-lime-500 to-green-500 px-4 py-2"
              >
                <Search size={18} className="text-white" />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-200 hover:text-lime-400 transition-colors px-3 py-2 rounded-lg hover:bg-slate-800/50"
              >
                Inicio
              </Link>
              <Link 
                to="/movies" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-200 hover:text-lime-400 transition-colors px-3 py-2 rounded-lg hover:bg-slate-800/50"
              >
                Películas
              </Link>
              <Link 
                to="/tops" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-200 hover:text-lime-400 transition-colors px-3 py-2 rounded-lg hover:bg-slate-800/50"
              >
                Anime Tops
              </Link>
            </nav>

            {/* Auth Buttons / User Info */}
            <div className="border-t border-slate-700 pt-3 space-y-2">
              {user ? (
                <>
                  <div className="px-3 py-2 bg-slate-800/30 rounded-lg">
                    <p className="text-sm font-semibold text-gray-200">{user.name || user.email}</p>
                    <p className="text-xs text-gray-400 mt-1">{user.role || "Usuario"}</p>
                  </div>

                  {canAccessDashboard && (
                    <button 
                      onClick={() => {
                        goToDashboard();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-200 hover:bg-slate-800/50 rounded-lg"
                    >
                      <AiOutlineDashboard className="mr-3 h-5 w-5 text-lime-500" />
                      Dashboard
                    </button>
                  )}

                  <button 
                    onClick={() => {
                      goToConfiguration();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-200 hover:bg-slate-800/50 rounded-lg"
                  >
                    <AiOutlineSetting className="mr-3 h-5 w-5 text-lime-500" />
                    Configuración
                  </button>

                  <button 
                    onClick={handleLogout} 
                    className="flex items-center w-full px-3 py-2 text-sm text-red-400 hover:bg-slate-800/50 rounded-lg"
                  >
                    <AiOutlineLogout className="mr-3 h-5 w-5 text-red-400" />
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-2 bg-lime-500/90 hover:bg-lime-600 text-gray-900 font-semibold text-sm rounded-lg transition-all duration-200"
                  >
                    <AiOutlineLogin className="h-5 w-5" />
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-2 bg-slate-700 hover:bg-slate-600 text-gray-200 font-medium text-sm rounded-lg border border-slate-600 transition-all duration-200"
                  >
                    <AiOutlineUserAdd className="h-5 w-5 text-lime-400" />
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}