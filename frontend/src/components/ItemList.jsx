import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Zap } from 'lucide-react';

export default function CyberpunkLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Error de login');
      alert(`Acceso autorizado - Bienvenido ${data.user.username}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Mantener tu fondo animado, grid overlay y demás */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4 p-4 border-2 border-cyan-500 rounded-lg bg-black/50 backdrop-blur-sm">
            <Zap className="w-12 h-12 text-cyan-400" />
          </div>
          <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 uppercase tracking-widest">System Access</h1>
          <p className="text-cyan-300 font-mono text-sm">// Nexus Interface Authentication Required</p>
        </div>

        {/* Form */}
        <div className="relative bg-black border-2 border-cyan-500 rounded-lg p-8 backdrop-blur-sm" style={{ boxShadow: '0 0 30px rgba(6, 182, 212, 0.4), inset 0 0 20px rgba(6, 182, 212, 0.1)' }}>
          {/* Email */}
          <div className="relative mb-6">
            <label className="block text-cyan-400 text-sm font-mono mb-2 uppercase tracking-wider">Email ID</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-500" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="usuario@cyber.net"
                className="w-full bg-gray-900/50 border-2 border-cyan-500/50 rounded text-cyan-100 pl-12 pr-4 py-3 focus:outline-none focus:border-pink-500 focus:shadow-lg focus:shadow-pink-500/50 transition-all duration-300 font-mono" />
            </div>
          </div>

          {/* Password */}
          <div className="relative mb-6">
            <label className="block text-cyan-400 text-sm font-mono mb-2 uppercase tracking-wider">Access Code</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-500" />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full bg-gray-900/50 border-2 border-cyan-500/50 rounded text-cyan-100 pl-12 pr-12 py-3 focus:outline-none focus:border-pink-500 focus:shadow-lg focus:shadow-pink-500/50 transition-all duration-300 font-mono" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-500 hover:text-pink-500 transition-colors">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button onClick={handleSubmit} disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 text-black font-bold py-3 rounded uppercase tracking-widest transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group">
            {isLoading ? 'Connecting...' : 'Ingresar'}
          </button>
        </div>
      </div>
    </div>
  );
}
