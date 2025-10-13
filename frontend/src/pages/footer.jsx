import React, { useState } from 'react';

const Footer = () => {
  const [glitchActive, setGlitchActive] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black text-white overflow-hidden">
      {/* Animated background layers */}
      <div className="absolute inset-0">
        {/* Moving particles */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Diagonal lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0, 255, 255, 0.3) 10px, rgba(0, 255, 255, 0.3) 11px)',
          }}></div>
        </div>
      </div>

      {/* Top glowing border */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400/50"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        
        {/* Top section with logo and tagline */}
        <div className="flex flex-col items-center text-center mb-16">
          <div 
            className="relative mb-4"
            onMouseEnter={() => setGlitchActive(true)}
            onMouseLeave={() => setGlitchActive(false)}
          >
            <h2 className="text-6xl font-black tracking-tighter relative">
              <span className={`relative inline-block ${glitchActive ? 'animate-glitch' : ''}`}>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                  NEUROLINK
                </span>
                {glitchActive && (
                  <>
                    <span className="absolute top-0 left-0 text-cyan-400 opacity-70" style={{ transform: 'translate(-2px, 2px)' }}>
                      NEUROLINK
                    </span>
                    <span className="absolute top-0 left-0 text-pink-500 opacity-70" style={{ transform: 'translate(2px, -2px)' }}>
                      NEUROLINK
                    </span>
                  </>
                )}
              </span>
            </h2>
          </div>
          <p className="text-gray-400 text-lg font-light tracking-wide">
            [ CONNECTING MINDS · BREAKING LIMITS · INFINITE POSSIBILITIES ]
          </p>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            <span className="text-green-400 text-sm font-mono">SYSTEM ONLINE</span>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1 */}
          <div>
            <h3 className="text-cyan-400 font-bold mb-6 uppercase text-sm tracking-widest relative inline-block">
              <span className="relative z-10">EXPLORE</span>
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-cyan-400 to-transparent"></div>
            </h3>
            <ul className="space-y-4">
              {['Home', 'About', 'Services', 'Projects'].map((item) => (
                <li key={item}>
                  <a href="#" className="group flex items-center text-gray-400 hover:text-white transition-all duration-300">
                    <span className="text-cyan-400 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">{'>'}</span>
                    <span className="relative">
                      {item}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-purple-400 font-bold mb-6 uppercase text-sm tracking-widest relative inline-block">
              <span className="relative z-10">RESOURCES</span>
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-purple-400 to-transparent"></div>
            </h3>
            <ul className="space-y-4">
              {['Documentation', 'API', 'Support', 'Community'].map((item) => (
                <li key={item}>
                  <a href="#" className="group flex items-center text-gray-400 hover:text-white transition-all duration-300">
                    <span className="text-purple-400 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">{'>'}</span>
                    <span className="relative">
                      {item}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-purple-400 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-pink-400 font-bold mb-6 uppercase text-sm tracking-widest relative inline-block">
              <span className="relative z-10">COMPANY</span>
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-pink-400 to-transparent"></div>
            </h3>
            <ul className="space-y-4">
              {['About Us', 'Careers', 'Press', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="group flex items-center text-gray-400 hover:text-white transition-all duration-300">
                    <span className="text-pink-400 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">{'>'}</span>
                    <span className="relative">
                      {item}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-pink-400 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Social */}
          <div>
            <h3 className="text-cyan-400 font-bold mb-6 uppercase text-sm tracking-widest relative inline-block">
              <span className="relative z-10">CONNECT</span>
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-cyan-400 to-transparent"></div>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {['TW', 'GH', 'LI', 'DS'].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className="relative group h-12 flex items-center justify-center border border-gray-700 hover:border-cyan-400 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 font-bold text-gray-400 group-hover:text-black transition-colors duration-300">
                    {social}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </a>
              ))}
            </div>
            <div className="mt-6">
              <p className="text-gray-500 text-xs mb-2">MAIL US AT:</p>
              <a href="mailto:hello@neurolink.io" className="text-cyan-400 hover:text-cyan-300 text-sm">
                hello@neurolink.io
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8"></div>
          
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 text-gray-500 text-sm">
              <span className="font-mono">© {currentYear}</span>
              <span className="hidden md:inline">·</span>
              <span>NEUROLINK SYSTEMS</span>
              <span className="hidden md:inline">·</span>
              <span className="text-xs bg-gray-800 px-2 py-1 border border-gray-700">v4.2.0</span>
            </div>
            
            <div className="flex gap-6 text-sm">
              {['Privacy', 'Terms', 'Cookies'].map((item, i) => (
                <a
                  key={item}
                  href="#"
                  className="text-gray-500 hover:text-cyan-400 transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-cyan-400 opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-purple-600 opacity-30"></div>
      
      {/* Glow effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 blur-3xl pointer-events-none"></div>
    </footer>
  );
};

export default Footer;