<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Zap, Loader2 } from 'lucide-react';

const Ofertas = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        
         const response = await fetch(`https://localhost:4019/api/productos/ofertas`);
        
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
=======
 import React from 'react'
>>>>>>> 521318ca93b9d1eb69454b53e8539f889b36e374
 
 const Offerts = () => {
   return (
     <div>
        agregar 
     </div>
   )
 }
 
 export default Offerts
 