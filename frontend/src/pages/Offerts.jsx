 import React, { useState, useEffect } from 'react';
import { Zap, Loader2 } from 'lucide-react';

const Ofertas = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://prickly-milli-cheanime-b581b454.koyeb.app/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const allProducts = await response.json();
        
         if (Array.isArray(allProducts)) {
           const filteredOffers = allProducts.filter(product => 
            product.en_ofertas === '1' || product.en_ofertas === 1
          );
          
           const formattedOffers = filteredOffers.map(product => ({
            id: product.id,
            title: product.NombreProducto || product.TITLE || 'Producto',
            description: product.Descripcion || 'Sin descripción',
            price: product.Precio || product.price || 0,
            discount: 15
          }));
          
          setOffers(formattedOffers);
        } else {
          console.error('Expected array but got:', typeof allProducts);
          setOffers([]);
        }
      } catch (error) {
        console.error('Error fetching offers:', error);
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
        <p className="text-lg text-cyan-400 font-mono">NO OFFERS FOUND</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="container mx-auto max-w-7xl">
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-gray-900 border border-cyan-400/30 hover:border-cyan-400 transition-all duration-300 group relative overflow-hidden">
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ofertas;