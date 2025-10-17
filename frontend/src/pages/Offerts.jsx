import React, { useState, useEffect } from 'react';
import { Zap, Loader2 } from 'lucide-react';

const Ofertas = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        
         const response = await fetch(`https://prickly-milli-cheanime-b581b454.koyeb.app/api/productos/ofertas`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const offersData = await response.json();

        
        if (Array.isArray(offersData)) {
          // ✅ CORREGIDO: Usar propiedades correctas del backend
          const formattedOffers = offersData.map(product => ({
            id: product.ProductoId || product.id,
            title: product.nombre || product.NombreProducto || 'Producto',
            description: product.descripcion || product.Descripcion || 'Sin descripción',
            price: product.precio || product.Precio || 0,
            originalPrice: product.precio_original || product.precio,
            image: product.imagen || product.Imagen || '',
            category: product.categoria || product.category || '',
            discount: product.precio_original ? 
              Math.round(((product.precio_original - product.precio) / product.precio_original) * 100) : 0,
            en_oferta: product.en_oferta
          }));
          
          setOffers(formattedOffers);
        } else {
           setOffers([]);
        }
      } catch (error) {
         setOffers([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!Array.isArray(offers) || offers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <Zap className="w-16 h-16 mb-4 text-cyan-400" />
        <p className="text-lg text-cyan-400 font-mono">NO HAY OFERTAS DISPONIBLES</p>
        <p className="text-gray-400 text-sm mt-2">Vuelve a intentarlo más tarde</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 mb-4">
            SPECIAL OFFERS
          </h1>
 
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {offers.map((offer) => (
            <div 
              key={offer.id} 
              className="bg-gray-900 border border-cyan-400/30 rounded-lg overflow-hidden hover:border-cyan-400 transition-all duration-300 group relative"
            >
              {/* Badge de descuento */}
              {offer.discount > 0 && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="bg-red-500 text-white px-3 py-1 text-sm font-bold rounded-full">
                    -{offer.discount}%
                  </span>
                </div>
              )}

              {/* Imagen del producto */}
              <div className="h-48 bg-gray-800 overflow-hidden">
                {offer.image ? (
                  <img 
                    src={offer.image} 
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-700">
                    <Zap className="w-12 h-12 text-gray-500" />
                  </div>
                )}
              </div>

              {/* Información del producto */}
              <div className="p-4">
                <h3 className="font-bold text-white mb-2 line-clamp-2">
                  {offer.title}
                </h3>
                
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {offer.description}
                </p>

                {/* Precios */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl font-bold text-cyan-400">
                    ${offer.price}
                  </span>
                  {offer.originalPrice && offer.originalPrice > offer.price && (
                    <span className="text-lg line-through text-gray-500">
                      ${offer.originalPrice}
                    </span>
                  )}
                </div>

                {/* Categoría */}
                {offer.category && (
                  <div className="mb-3">
                    <span className="text-xs text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">
                      {offer.category}
                    </span>
                  </div>
                )}

                {/* Botón */}
                <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-4 rounded transition-colors">
                  Ver Producto
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ofertas;