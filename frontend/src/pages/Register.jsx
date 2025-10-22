import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Shield, CheckCircle, XCircle } from 'lucide-react';

export default function CyberpunkRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState({
    nickname: null,
    email: null
  });

  const [error, setError] = useState('');

  // Dominios permitidos
  const allowedDomains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com',
    'aol.com', 'protonmail.com', 'mail.com', 'zoho.com', 'yandex.com',
    'live.com', 'msn.com', 'gmx.com', 'tutanota.com', 'hushmail.com'
  ];

  const [isDomainValid, setIsDomainValid] = useState(null);

  useEffect(() => {
    if (formData.email) {
      const emailDomain = formData.email.split('@')[1]?.toLowerCase();
      setIsDomainValid(emailDomain && allowedDomains.includes(emailDomain));
    } else {
      setIsDomainValid(null);
    }
  }, [formData.email]);

  useEffect(() => {
    if (formData.nickname) {
      const timer = setTimeout(() => {
        checkRegisterAvailability('nickname', formData.nickname);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setAvailability(prev => ({ ...prev, nickname: null }));
    }
  }, [formData.nickname]);

  useEffect(() => {
    if (formData.email) {
      const timer = setTimeout(() => {
        checkRegisterAvailability('email', formData.email);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setAvailability(prev => ({ ...prev, email: null }));
    }
  }, [formData.email]);

  const checkRegisterAvailability = async (field, value) => {
    if (!value.trim()) return;
    setIsChecking(true);
    try {
      const response = await fetch(`http://localhost:4019/api/check-register?${field}=${encodeURIComponent(value.trim())}`);
      if (!response.ok) throw new Error('Error al verificar disponibilidad');
      const data = await response.json();
      if (field === 'nickname') {
        setAvailability(prev => ({ ...prev, nickname: !data.data.nicknameExists }));
      } else if (field === 'email') {
        setAvailability(prev => ({ ...prev, email: !data.data.emailExists }));
      }
    } catch {
      setAvailability(prev => ({ ...prev, [field]: true }));
    } finally {
      setIsChecking(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // limpiar error al escribir
  };

  const handleSubmit = async () => {
    // Validaciones visuales
    if (!acceptTerms) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }
    if (availability.nickname === false || availability.email === false) {
      setError('Algunos datos ya están en uso');
      return;
    }
    if (!isDomainValid) {
      setError('Dominio de email no permitido');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:4019/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          NickName: formData.nickname.trim(),
          UsersEmail: formData.email.trim(),
          HashPw: formData.password.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al registrar usuario');
      alert('¡Registro exitoso!');
    } catch (err) {
      setError(err.message || 'Error de conexión');
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
      {/* Fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4 p-4 border-2 border-cyan-500 rounded-lg bg-black/50 backdrop-blur-sm">
            <Shield className="w-12 h-12 text-cyan-400" />
          </div>
          <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 uppercase tracking-widest">
            Nexus Profile
          </h1>
          <p className="text-cyan-300 font-mono text-sm">// Create Your Digital Identity</p>
        </div>

        {/* Contenedor con efecto error */}
        <div
          className={`relative bg-black border-2 rounded-lg p-8 backdrop-blur-sm transition-all duration-300 ${
            error
              ? 'border-red-500 shadow-lg shadow-red-500/30'
              : 'border-cyan-500'
          }`}
          style={{
            boxShadow: error
              ? '0 0 30px rgba(239, 68, 68, 0.4), inset 0 0 20px rgba(239, 68, 68, 0.1)'
              : '0 0 30px rgba(6, 182, 212, 0.4), inset 0 0 20px rgba(6, 182, 212, 0.1)',
          }}
        >
          <div className="space-y-5">
            {/* Nickname */}
            <div className="relative">
              <label className="block text-cyan-400 text-sm font-mono mb-2 uppercase tracking-wider">Nickname</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-500" />
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => handleChange('nickname', e.target.value)}
                  className="w-full bg-gray-900/50 border-2 border-cyan-500/50 rounded text-cyan-100 pl-12 pr-10 py-3 focus:outline-none focus:border-pink-500 transition-all duration-300 font-mono"
                  placeholder="cyber_operator"
                />
                {formData.nickname && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {isChecking ? (
                      <div className="w-5 h-5 border-t-2 border-r-2 border-cyan-500 rounded-full animate-spin"></div>
                    ) : availability.nickname === true ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : availability.nickname === false ? (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ) : null}
                  </div>
                )}
              </div>
              {availability.nickname === false && (
                <p className="text-red-400 text-xs font-mono mt-1">This nickname is already in use</p>
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <label className="block text-cyan-400 text-sm font-mono mb-2 uppercase tracking-wider">Email ID</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full bg-gray-900/50 border-2 border-cyan-500/50 rounded text-cyan-100 pl-12 pr-10 py-3 focus:outline-none focus:border-pink-500 transition-all duration-300 font-mono"
                  placeholder="usuario@cyber.net"
                />
                {formData.email && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {isChecking ? (
                      <div className="w-5 h-5 border-t-2 border-r-2 border-cyan-500 rounded-full animate-spin"></div>
                    ) : availability.email === false || isDomainValid === false ? (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ) : availability.email === true && isDomainValid === true ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : null}
                  </div>
                )}
              </div>
              {availability.email === false && (
                <p className="text-red-400 text-xs font-mono mt-1">This email is already in use</p>
              )}
              {isDomainValid === false && (
                <p className="text-red-400 text-xs font-mono mt-1">Domain not allowed</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-cyan-400 text-sm font-mono mb-2 uppercase tracking-wider">Access Code</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="w-full bg-gray-900/50 border-2 border-cyan-500/50 rounded text-cyan-100 pl-12 pr-12 py-3 focus:outline-none focus:border-pink-500 transition-all duration-300 font-mono"
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

            {/* Términos */}
            <div className="flex items-start space-x-3 p-4 bg-gray-900/30 border border-cyan-500/30 rounded">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-5 h-5 mt-0.5 bg-gray-900 border-2 border-cyan-500 rounded focus:ring-2 focus:ring-pink-500 transition-all cursor-pointer"
              />
              <label className="text-cyan-300 text-sm font-mono leading-relaxed cursor-pointer">
                I accept the{' '}
                <button className="text-pink-400 hover:text-pink-300 underline">terms and conditions</button> and{' '}
                <button className="text-pink-400 hover:text-pink-300 underline">privacy policy</button>
              </label>
            </div>

            {/* Error global */}
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500 rounded text-red-300 text-sm font-mono animate-pulse">
                {error}
              </div>
            )}

            {/* Botón */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full font-bold py-3 rounded uppercase tracking-widest transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 ${
                error
                  ? 'bg-gradient-to-r from-red-500 to-red-700 text-white'
                  : 'bg-gradient-to-r from-cyan-500 to-pink-500 text-black'
              }`}
            >
              {isLoading ? 'Creating Profile...' : 'Initialize Neural Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
