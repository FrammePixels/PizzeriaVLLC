import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Zap } from 'lucide-react';

export default function CyberpunkLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);

    try {
       const response = await fetch('http://localhost:4019/api/login', {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setIsLoading(false);
       //   ('/dashboard');
      } else {
        setIsLoading(false);
       }

    } catch (error) {
      setIsLoading(false);
      console.error('Error al iniciar sesión:', error);
      alert('Error de conexión con el servidor');
    }
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
            Nexus Login
          </h1>
          <p className="text-cyan-300 font-mono text-sm">
            // Access Your Digital Identity
          </p>
        </div>

        {/* Login form */}
        <div 
          className="relative bg-black border-2 border-cyan-500 rounded-lg p-8 backdrop-blur-sm"
          style={{
            boxShadow: '0 0 30px rgba(6, 182, 212, 0.4), inset 0 0 20px rgba(6, 182, 212, 0.1)'
          }}
        >
          {/* Email field */}
          <div className="relative mb-5">
            <label className="block text-cyan-400 text-sm font-mono mb-2 uppercase tracking-wider">
              Email
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
          <div className="relative mb-5">
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

          {/* Submit button */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 text-black font-bold py-3 rounded uppercase tracking-widest transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                Accessing Profile...
              </span>
            ) : (
              <span className="relative z-10">Enter Nexus</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
