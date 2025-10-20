import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Zap, Shield, Check } from 'lucide-react';

export default function CyberpunkRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    Nombre: '',
    Email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // --- Cambiado a MySQL backend ---
  const handleSubmit = async () => {
  if (!acceptTerms) {
    alert('Debes aceptar los términos y condiciones');
    return;
  }
  if (formData.password !== formData.confirmPassword) {
    alert('Las contraseñas no coinciden');
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch('http://localhost:4019/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nick: formData.Nombre.trim(),
        email: formData.Email.trim(),
        password: formData.HashPw, // el backend se encargará de hashearlo
      }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message);

    alert('Registro exitoso - Perfil neural creado');
    console.log('Usuario registrado:', data);

    setFormData({ username: '', email: '', password: '', confirmPassword: '' });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    alert(`Error al registrar usuario: ${error.message}`);
  } finally {
    setIsLoading(false);
  }
};

  const getPasswordStrength = () => {
    const pwd = formData.password;
    if (pwd.length === 0) return { strength: 0, label: '', color: '' };
    if (pwd.length < 6) return { strength: 33, label: 'Débil', color: 'bg-red-500' };
    if (pwd.length < 10) return { strength: 66, label: 'Media', color: 'bg-yellow-500' };
    return { strength: 100, label: 'Fuerte', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

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

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block mb-4 p-4 border-2 border-cyan-500 rounded-lg bg-black/50 backdrop-blur-sm">
            <Shield className="w-12 h-12 text-cyan-400" />
          </div>
          <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 uppercase tracking-widest">
            Nexus Profile
          </h1>
          <p className="text-cyan-300 font-mono text-sm">// Create Your Digital Identity</p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-500" />
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-500" />
          </div>
        </div>

        <div 
          className="relative bg-black border-2 border-cyan-500 rounded-lg p-8 backdrop-blur-sm"
          style={{
            boxShadow: '0 0 30px rgba(6, 182, 212, 0.4), inset 0 0 20px rgba(6, 182, 212, 0.1)'
          }}
        >
          <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-pink-500" />
          <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-pink-500" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 border-cyan-500" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-cyan-500" />

          <div className="space-y-5">
            {/* Username */}
            <div className="relative">
              <label className="block text-cyan-400 text-sm font-mono mb-2 uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-500" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  className="w-full bg-gray-900/50 border-2 border-cyan-500/50 rounded text-cyan-100 pl-12 pr-4 py-3 focus:outline-none focus:border-pink-500 focus:shadow-lg focus:shadow-pink-500/50 transition-all duration-300 font-mono"
                  placeholder="cyber_operator"
                />
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <label className="block text-cyan-400 text-sm font-mono mb-2 uppercase tracking-wider">
                Email ID
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full bg-gray-900/50 border-2 border-cyan-500/50 rounded text-cyan-100 pl-12 pr-4 py-3 focus:outline-none focus:border-pink-500 focus:shadow-lg focus:shadow-pink-500/50 transition-all duration-300 font-mono"
                  placeholder="usuario@cyber.net"
                />
              </div>
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-cyan-400 text-sm font-mono mb-2 uppercase tracking-wider">
                Access Code
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
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
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-cyan-400 font-mono">Seguridad:</span>
                    <span className={`text-xs font-mono ${
                      passwordStrength.strength === 33 ? 'text-red-400' :
                      passwordStrength.strength === 66 ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-cyan-400 text-sm font-mono mb-2 uppercase tracking-wider">
                Confirm Code
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-500" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className="w-full bg-gray-900/50 border-2 border-cyan-500/50 rounded text-cyan-100 pl-12 pr-12 py-3 focus:outline-none focus:border-pink-500 focus:shadow-lg focus:shadow-pink-500/50 transition-all duration-300 font-mono"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-500 hover:text-pink-500 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <div className="flex items-center mt-2 text-green-400 text-xs font-mono">
                  <Check className="w-4 h-4 mr-1" />
                  Las contraseñas coinciden
                </div>
              )}
            </div>

            {/* Accept Terms */}
            <div className="flex items-start space-x-3 p-4 bg-gray-900/30 border border-cyan-500/30 rounded">
              <input 
                type="checkbox" 
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-5 h-5 mt-0.5 bg-gray-900 border-2 border-cyan-500 rounded focus:ring-2 focus:ring-pink-500 transition-all cursor-pointer"
              />
              <label className="text-cyan-300 text-sm font-mono leading-relaxed cursor-pointer" onClick={() => setAcceptTerms(!acceptTerms)}>
                Acepto los{' '}
                <button className="text-pink-400 hover:text-pink-300 transition-colors underline">
                  términos y condiciones
                </button>
                {' '}del protocolo neural y la{' '}
                <button className="text-pink-400 hover:text-pink-300 transition-colors underline">
                  política de privacidad
                </button>
              </label>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 text-black font-bold py-3 rounded uppercase tracking-widest transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                  Creating Profile...
                </span>
              ) : (
                <span className="relative z-10">Initialize Neural Profile</span>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            {/* Quick Register */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-cyan-500/30" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-black text-cyan-400 font-mono uppercase tracking-wider">
                  Quick Register
                </span>
              </div>
            </div>

            {/* Quick Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center space-x-2 bg-gray-900/50 border-2 border-cyan-500/50 rounded py-3 hover:border-pink-500 hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 group"
              >
                <User className="w-5 h-5 text-cyan-400 group-hover:text-pink-400 transition-colors" />
                <span className="text-cyan-400 font-mono text-sm group-hover:text-pink-400 transition-colors">
                  Neural ID
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

          <div 
            className="absolute inset-0 pointer-events-none rounded-lg"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(6, 182, 212, 0.03) 0px, rgba(6, 182, 212, 0.03) 1px, transparent 1px, transparent 2px)',
            }}
          />
        </div>

        {/* Already registered */}
        <div className="text-center mt-8">
          <p className="text-gray-500 font-mono text-sm">
            Already registered?{' '}
            <button className="text-cyan-400 hover:text-pink-400 transition-colors">
              Access System
            </button>
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400 text-xs font-mono uppercase tracking-wider">
              Registration System Online
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
