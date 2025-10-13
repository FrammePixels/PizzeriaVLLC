import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Zap } from 'lucide-react';

export default function CyberpunkLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Acceso autorizado - Sistema conectado');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Grid pattern overlay */}
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

      {/* Login container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4 p-4 border-2 border-cyan-500 rounded-lg bg-black/50 backdrop-blur-sm">
            <Zap className="w-12 h-12 text-cyan-400" />
          </div>
          <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 uppercase tracking-widest">
            System Access
          </h1>
          <p className="text-cyan-300 font-mono text-sm">
            // Nexus Interface Authentication Required
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-500" />
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-500" />
          </div>
        </div>

        {/* Login form */}
        <div 
          className="relative bg-black border-2 border-cyan-500 rounded-lg p-8 backdrop-blur-sm"
          style={{
            boxShadow: '0 0 30px rgba(6, 182, 212, 0.4), inset 0 0 20px rgba(6, 182, 212, 0.1)'
          }}
        >
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-pink-500" />
          <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-pink-500" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 border-cyan-500" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-cyan-500" />

          <div className="space-y-6">
            {/* Email field */}
            <div className="relative">
              <label className="block text-cyan-400 text-sm font-mono mb-2 uppercase tracking-wider">
                Email ID
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-900/50 border-2 border-cyan-500/50 rounded text-cyan-100 pl-12 pr-4 py-3 focus:outline-none focus:border-pink-500 focus:shadow-lg focus:shadow-pink-500/50 transition-all duration-300 font-mono"
                  placeholder="usuario@cyber.net"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="relative">
              <label className="block text-cyan-400 text-sm font-mono mb-2 uppercase tracking-wider">
                Access Code
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-900/50 border-2 border-cyan-500/50 rounded text-cyan-100 pl-12 pr-12 py-3 focus:outline-none focus:border-pink-500 focus:shadow-lg focus:shadow-pink-500/50 transition-all duration-300 font-mono"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-500 hover:text-pink-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 bg-gray-900 border-2 border-cyan-500 rounded focus:ring-2 focus:ring-pink-500 transition-all"
                />
                <span className="text-cyan-300 group-hover:text-pink-400 transition-colors font-mono">
                  Remember me
                </span>
              </label>
              <button className="text-pink-400 hover:text-pink-300 transition-colors font-mono">
                Recover Access?
              </button>
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 text-black font-bold py-3 rounded uppercase tracking-widest transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                  Connecting...
                </span>
              ) : (
                <span className="relative z-10">Ingresar</span>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-cyan-500/30" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-black text-cyan-400 font-mono uppercase tracking-wider">
                  Or Continue With
                </span>
              </div>
            </div>

            {/* Social login */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center space-x-2 bg-gray-900/50 border-2 border-cyan-500/50 rounded py-3 hover:border-pink-500 hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 group"
              >
                <User className="w-5 h-5 text-cyan-400 group-hover:text-pink-400 transition-colors" />
                <span className="text-cyan-400 font-mono text-sm group-hover:text-pink-400 transition-colors">
                  Nexus ID
                </span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center space-x-2 bg-gray-900/50 border-2 border-cyan-500/50 rounded py-3 hover:border-pink-500 hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 group"
              >
                <Zap className="w-5 h-5 text-cyan-400 group-hover:text-pink-400 transition-colors" />
                <span className="text-cyan-400 font-mono text-sm group-hover:text-pink-400 transition-colors">
                  Quick Auth
                </span>
              </button>
            </div>
          </div>

          {/* Scanlines effect */}
          <div 
            className="absolute inset-0 pointer-events-none rounded-lg"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(6, 182, 212, 0.03) 0px, rgba(6, 182, 212, 0.03) 1px, transparent 1px, transparent 2px)',
            }}
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 font-mono text-sm">
            New user?{' '}
            <button className="text-cyan-400 hover:text-pink-400 transition-colors">
              Register Nexus Profile
            </button>
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400 text-xs font-mono uppercase tracking-wider">
              System Online
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}