import React, { useState } from 'react';
import { Zap, Shield, Cpu, Eye } from 'lucide-react';

const ItemCard = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative bg-black border-2 border-cyan-500 rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:border-pink-500 hover:shadow-2xl hover:shadow-pink-500/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxShadow: isHovered 
          ? '0 0 30px rgba(236, 72, 153, 0.6), inset 0 0 20px rgba(6, 182, 212, 0.2)'
          : '0 0 15px rgba(6, 182, 212, 0.4)'
      }}
    >
      {/* Glitch effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-pink-500/10 pointer-events-none" />
      
      {/* Status badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className="bg-cyan-500 text-black text-xs font-bold px-2 py-1 rounded uppercase tracking-wider animate-pulse">
          {item.status || "Disponible"}
        </span>
      </div>

      {/* Image container */}
      <div className="relative h-48 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover transition-all duration-500"
          style={{
            filter: isHovered ? 'brightness(1.2) saturate(1.5)' : 'brightness(0.8) saturate(1.2)',
          }}
        />
        {/* Scanlines effect */}
        <div 
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.1) 0px, rgba(0, 0, 0, 0.1) 1px, transparent 1px, transparent 2px)',
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4 relative">
        {/* Title */}
        <h3 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 uppercase tracking-wide">
          {item.name}
        </h3>

        {/* Category */}
        <p className="text-cyan-300 text-sm mb-3 font-mono uppercase tracking-wider">
          {item.category}
        </p>

        {/* Stats - CORREGIDO: key única */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {item.stats?.map((stat, idx) => (
            <div key={`${item.id}-stat-${idx}`} className="flex items-center space-x-2 bg-gray-900/50 border border-cyan-500/30 rounded px-2 py-1">
              {stat.icon}
              <div className="flex-1">
                <div className="text-xs text-gray-400 uppercase">{stat.label}</div>
                <div className="text-sm font-bold text-cyan-400">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Price and action */}
        <div className="flex items-center justify-between">
          <div>
            {item.oldPrice && (
              <div className="text-xs text-gray-500 line-through">{item.oldPrice}</div>
            )}
            <div className="text-2xl font-bold text-pink-500">{item.price}</div>
          </div>
          <button 
            className="bg-gradient-to-r from-cyan-500 to-pink-500 text-black font-bold px-6 py-2 rounded uppercase tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/50 hover:scale-110"
          >
            Adquirir
          </button>
        </div>

        {/* Decorative corner lines */}
        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-cyan-500" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-pink-500" />
      </div>
    </div>
  );
};

export default function App() {
  const products = [
    {
      id: 1,
      name: "Neural Implant X-7",
      category: "Cyberware",
      status: "Online",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop",
      price: "₡ 2,499",
      oldPrice: "₡ 3,499",
      stats: [
        { icon: <Cpu className="w-4 h-4 text-cyan-400" />, label: "CPU", value: "98%" },
        { icon: <Shield className="w-4 h-4 text-pink-400" />, label: "Shield", value: "85%" },
        { icon: <Zap className="w-4 h-4 text-yellow-400" />, label: "Power", value: "92%" },
        { icon: <Eye className="w-4 h-4 text-purple-400" />, label: "Vision", value: "HD+" },
      ]
    },
    {
      id: 2,
      name: "Stealth Armor MK-II",
      category: "Combat Gear",
      status: "Active",
      image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=400&h=300&fit=crop",
      price: "₡ 4,999",
      oldPrice: "₡ 6,999",
      stats: [
        { icon: <Shield className="w-4 h-4 text-cyan-400" />, label: "Defense", value: "95%" },
        { icon: <Zap className="w-4 h-4 text-pink-400" />, label: "Speed", value: "88%" },
        { icon: <Cpu className="w-4 h-4 text-yellow-400" />, label: "Tech", value: "90%" },
        { icon: <Eye className="w-4 h-4 text-purple-400" />, label: "Stealth", value: "99%" },
      ]
    },
    {
      id: 3,
      name: "Plasma Rifle v3",
      category: "Weapons",
      status: "Armed",
      image: "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=400&h=300&fit=crop",
      price: "₡ 3,799",
      oldPrice: "₡ 5,299",
      stats: [
        { icon: <Zap className="w-4 h-4 text-cyan-400" />, label: "Damage", value: "999" },
        { icon: <Cpu className="w-4 h-4 text-pink-400" />, label: "Fire Rate", value: "Fast" },
        { icon: <Shield className="w-4 h-4 text-yellow-400" />, label: "Range", value: "500m" },
        { icon: <Eye className="w-4 h-4 text-purple-400" />, label: "Accuracy", value: "97%" },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-black p-8">
       <div className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 uppercase tracking-widest">
          Cyber Market 2077
        </h1>
        <p className="text-cyan-300 font-mono text-lg">
          // Equipamiento de última generación para operadores cibernéticos
        </p>
      </div>

       <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(product => (
          <ItemCard key={product.id} item={product} />
        ))}
      </div>

       <div className="max-w-7xl mx-auto mt-12 text-center">
        <div className="inline-block border-t-2 border-b-2 border-cyan-500 py-2 px-8">
          <p className="text-cyan-500 font-mono text-sm uppercase tracking-wider">
            Sistema de comercio seguro // Encrypted Connection Active
          </p>
        </div>
      </div>
    </div>
  );
}