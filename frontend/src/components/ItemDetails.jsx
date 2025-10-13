import React, { useState } from 'react';

const ItemDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('specs');

  // Datos de ejemplo
  const product = {
    name: "NEURAL SYNC PRO X",
    code: "NSP-2077-X",
    price: 2499.99,
    oldPrice: 3299.99,
    rating: 4.8,
    reviews: 1247,
    stock: 23,
    category: "Neural Interface",
    images: [
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800",
    ],
    description: "Interfaz neural de última generación con tecnología cuántica avanzada. Conecta tu mente directamente al ciberespacio con latencia cero.",
    features: [
      "Procesador Quantum Core 9.0",
      "Memoria Neural: 2TB",
      "Latencia: < 0.1ms",
      "Compatibilidad: Universal",
      "Batería: 72 horas",
      "Garantía: 5 años"
    ],
    specs: {
      "Procesador": "Quantum Core 9.0 - 128 núcleos",
      "Memoria": "2TB Neural RAM DDR6",
      "Conectividad": "5G, WiFi 7, Bluetooth 6.0, Neural Link",
      "Dimensiones": "145mm x 89mm x 12mm",
      "Peso": "180g",
      "Material": "Titanio grado militar + Fibra de carbono"
    }
  };

  const handleQuantityChange = (type) => {
    if (type === 'increment' && quantity < product.stock) {
      setQuantity(quantity + 1);
    } else if (type === 'decrement' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <a href="#" className="hover:text-cyan-400 transition-colors">Home</a>
          <span className="text-cyan-400">{'>'}</span>
          <a href="#" className="hover:text-cyan-400 transition-colors">Products</a>
          <span className="text-cyan-400">{'>'}</span>
          <span className="text-gray-400">{product.category}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Section - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative border-2 border-cyan-400 overflow-hidden group bg-gray-900">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
              <img 
                src={product.images[selectedImage]} 
                alt={product.name}
                className="w-full h-96 object-cover"
              />
              <div className="absolute top-4 right-4 bg-black/80 border border-cyan-400 px-3 py-1 text-xs font-mono text-cyan-400">
                IMG_{selectedImage + 1}/3
              </div>
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-16 h-16 border-l-4 border-t-4 border-cyan-400"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-r-4 border-b-4 border-purple-600"></div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative border-2 overflow-hidden transition-all duration-300 ${
                    selectedImage === index 
                      ? 'border-cyan-400 shadow-lg shadow-cyan-400/50' 
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  <img src={img} alt={`View ${index + 1}`} className="w-full h-24 object-cover" />
                  {selectedImage === index && (
                    <div className="absolute inset-0 bg-cyan-400/20"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right Section - Product Info */}
          <div className="space-y-6">
            
            {/* Product Code */}
            <div className="flex items-center gap-2">
              <span className="text-xs bg-gradient-to-r from-cyan-500 to-purple-600 px-3 py-1 font-mono">
                {product.code}
              </span>
              <span className="text-xs bg-gray-800 border border-gray-700 px-3 py-1 text-gray-400">
                {product.category}
              </span>
            </div>

            {/* Product Name */}
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-700'}>
                    ★
                  </span>
                ))}
                <span className="text-cyan-400 font-bold ml-2">{product.rating}</span>
              </div>
              <span className="text-gray-500 text-sm">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 py-4 border-t border-b border-gray-800">
              <div className="text-4xl font-bold text-cyan-400">
                ${product.price}
              </div>
              <div className="text-xl text-gray-500 line-through">
                ${product.oldPrice}
              </div>
              <div className="bg-pink-500 text-black px-3 py-1 text-sm font-bold">
                -24% OFF
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-mono">
                {product.stock} UNITS IN STOCK
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-400 leading-relaxed">
              {product.description}
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3">
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className="text-cyan-400">▶</span>
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 py-4">
              <span className="text-gray-400 text-sm uppercase">Cantidad:</span>
              <div className="flex items-center border-2 border-gray-700">
                <button
                  onClick={() => handleQuantityChange('decrement')}
                  className="px-4 py-2 border-r-2 border-gray-700 hover:bg-gray-800 transition-colors"
                >
                  -
                </button>
                <span className="px-6 py-2 font-bold">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange('increment')}
                  className="px-4 py-2 border-l-2 border-gray-700 hover:bg-gray-800 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 py-4 font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/50">
                Add to Cart
              </button>
              <button className="px-6 border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-black transition-all duration-300 font-bold">
                ♥
              </button>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-800">
              <div className="text-center">
                <div className="text-cyan-400 text-2xl mb-2">🚚</div>
                <div className="text-xs text-gray-400">Free Shipping</div>
              </div>
              <div className="text-center">
                <div className="text-purple-400 text-2xl mb-2">🔒</div>
                <div className="text-xs text-gray-400">Secure Payment</div>
              </div>
              <div className="text-center">
                <div className="text-pink-400 text-2xl mb-2">↻</div>
                <div className="text-xs text-gray-400">30 Days Return</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          <div className="flex gap-6 border-b-2 border-gray-800 mb-8">
            {['specs', 'details', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-6 uppercase font-bold text-sm tracking-wider transition-all duration-300 relative ${
                  activeTab === tab 
                    ? 'text-cyan-400' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-600"></div>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-gray-900 border border-gray-800 p-8">
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-3 border-b border-gray-800">
                    <span className="text-cyan-400 font-bold">{key}</span>
                    <span className="text-gray-300">{value}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'details' && (
              <div className="text-gray-400 space-y-4">
                <p>Experimenta la próxima evolución de la conectividad neural con el Neural Sync Pro X. Diseñado para profesionales que demandan el máximo rendimiento.</p>
                <p>Esta interfaz neural revolucionaria combina procesamiento cuántico con arquitectura neural avanzada, permitiendo una integración perfecta entre tu mente y el ciberespacio.</p>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-4">⭐</div>
                <p>Las reseñas se cargarán próximamente...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;