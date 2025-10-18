import React, { useState, useEffect } from 'react'
import { AlertTriangle, Home, Search, RefreshCw, Terminal, Wifi } from 'lucide-react'
import { Link } from 'react-router-dom'  
export default function Cyberpunk404() {
  const [glitchText, setGlitchText] = useState('404')
  const [scanLine, setScanLine] = useState(0)

  useEffect(() => {
    // Glitch effect on 404 text
    const glitchInterval = setInterval(() => {
      const glitches = ['404', '4Ø4', '4０4', '₄0₄', '404', '４０４']
      setGlitchText(glitches[Math.floor(Math.random() * glitches.length)])
    }, 150)

    // Scan line animation
    const scanInterval = setInterval(() => {
      setScanLine((prev) => (prev + 1) % 100)
    }, 50)

    return () => {
      clearInterval(glitchInterval)
      clearInterval(scanInterval)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-red-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Scan line effect */}
      <div
        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 blur-sm"
        style={{ top: `${scanLine}%`, transition: 'top 0.05s linear' }}
      />

      {/* Main content */}
      <div className="relative z-10 max-w-4xl w-full">
        <div className="text-center">
          {/* Alert icon */}
          <div className="flex justify-center mb-8">
            <div
              className="relative p-6 border-4 border-red-500 rounded-full bg-black/50 backdrop-blur-sm animate-pulse"
              style={{ boxShadow: '0 0 40px rgba(239, 68, 68, 0.6)' }}
            >
              <AlertTriangle className="w-16 h-16 text-red-500" />
              <div className="absolute inset-0 border-4 border-red-500/30 rounded-full animate-ping" />
            </div>
          </div>

          {/* 404 Glitch text */}
          <div className="mb-6 relative">
            <h1
              className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-red-500 uppercase tracking-widest select-none"
              style={{
                textShadow:
                  '0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(236, 72, 153, 0.5)',
                fontFamily: 'monospace'
              }}
            >
              {glitchText}
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="text-9xl font-bold text-cyan-500 opacity-20 blur-sm"
                style={{
                  transform: 'translate(2px, 2px)',
                  fontFamily: 'monospace'
                }}
              >
                {glitchText}
              </span>
            </div>
          </div>

          {/* Error title */}
          <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 uppercase tracking-wider">
            Page not Found
          </h2>

          {/* Error message box */}
          <div
            className="max-w-2xl mx-auto mb-8 p-6 bg-black border-2 border-red-500/50 rounded-lg backdrop-blur-sm relative"
            style={{
              boxShadow:
                '0 0 20px rgba(239, 68, 68, 0.3), inset 0 0 20px rgba(239, 68, 68, 0.1)'
            }}
          >
            <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-cyan-500" />
            <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-cyan-500" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-pink-500" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-pink-500" />

            <div className="flex items-start space-x-3 text-left">
              <Terminal className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-cyan-300 font-mono text-sm mb-2">
                  <span className="text-red-400">[ERROR]</span> The requested website cannot be found or the page you are looking for has been removed
                </p>
                <p className="text-gray-400 font-mono text-sm">
                 Please try again or contact the website administrator. 
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {/* ✅ Botón volver al inicio con Link */}
            <Link
              to="/"
              className="group relative px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold rounded uppercase tracking-wide transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/50 hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <Home className="w-5 h-5" />
                <span>Return to home</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            {/* Botón buscar */}
            <button className="group relative px-6 py-3 bg-gray-900/50 border-2 border-cyan-500/50 text-cyan-400 font-bold rounded uppercase tracking-wide transition-all duration-300 hover:border-pink-500 hover:text-pink-400 hover:shadow-lg hover:shadow-pink-500/30">
              <span className="flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Search...</span>
              </span>
            </button>

            {/* Botón reintentar */}
            <button
              onClick={() => window.location.reload()}
              className="group relative px-6 py-3 bg-gray-900/50 border-2 border-cyan-500/50 text-cyan-400 font-bold rounded uppercase tracking-wide transition-all duration-300 hover:border-pink-500 hover:text-pink-400 hover:shadow-lg hover:shadow-pink-500/30"
            >
              <span className="flex items-center space-x-2">
                <RefreshCw className="w-5 h-5 group-hover:animate-spin" />
                <span>Retry</span>
              </span>
            </button>

          </div>

          {/* Status indicators */}
          <div className="flex justify-center items-center space-x-6 text-sm font-mono">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-400 uppercase tracking-wider">Page Not Found</span>
            </div>
            <div className="h-4 w-px bg-cyan-500/30" />
            <div className="flex items-center space-x-2">
              <Wifi className="w-4 h-4 text-green-400" />
              <span className="text-green-400 uppercase tracking-wider">System Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
      <div
        className="absolute top-1/3 right-20 w-2 h-2 bg-pink-400 rounded-full animate-pulse"
        style={{ animationDelay: '0.5s' }}
      />
      <div
        className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-pulse"
        style={{ animationDelay: '1s' }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-red-400 rounded-full animate-pulse"
        style={{ animationDelay: '1.5s' }}
      />
    </div>
  )
}
