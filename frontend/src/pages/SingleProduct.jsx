import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Package, Truck, CreditCard, ChevronRight } from 'lucide-react';

const SingleProduct = () => {
  const { addToShop } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
          setError('ID de producto no proporcionado');
          setLoading(false);
          return;
      }
      
      try {
        const response = await fetch(`http://localhost:4019/api/products`);

        if (!response.ok) throw new Error('Error al cargar los productos');

        const productos = await response.json();
        
        const rawProduct = productos.find(p => p.ProductoId === Number(id));

        if (rawProduct) {
          const formattedProduct = {
            ...rawProduct,
            id: rawProduct.ProductoId 
          };
          
          setItem(formattedProduct);
        } else {
          setError('Producto no encontrado');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddToCart = () => {
    if (item) {
      const productToAdd = { ...item, quantity };
      addToShop(productToAdd);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm tracking-wider">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-red-950 border border-red-500 rounded-lg p-8 max-w-md">
          <p className="text-red-400 text-center">{error}</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 max-w-md">
          <p className="text-gray-400 text-center">Producto no disponible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
       <div className="fixed inset-0 bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
         <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <span>Home </span>
          <ChevronRight className="w-4 h-4" />
          <span>Products </span> 
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">{item.NombreProducto}</span>
          </div>

        <div className="grid lg:grid-cols-2 gap-12">
           <div className="space-y-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                <div className="aspect-square flex items-center justify-center p-8">
                  {item.imagen ? (
                    <img src={item.imagen} alt={item.nombre} className="w-full h-full object-contain" />
                  ) : (
                    <Package className="w-32 h-32 text-gray-700" />
                  )}
                </div>
              </div>
            </div>
          </div>

           <div className="space-y-8">
             <div className="inline-block">
              <span className="px-4 py-1.5 bg-cyan-500/10 border border-red-500 text-cyan-400 text-xs font-bold tracking-wider rounded-full">
                Quantity in Stock: {item.Stock}
              </span>
            </div>

             <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
                {item.NombreProducto}
              </h1>
              {item.Descripcion && (
                <p className="text-gray-400 text-lg leading-relaxed">
                  {item.Descripcion || item.Descripcion}
                </p>
              )}
            </div>

             <div className="border-t border-b border-gray-800 py-6">
              <div className="flex items-baseline gap-3">
                <div>
    
                </div>
                <span className="text-5xl font-bold text-cyan-400">
                  ${item.Precio}
                </span>
                
                <span className="text-gray-500 text-lg">ARS</span>
              </div>
            </div>

             <div>
              <label className="block text-sm font-medium text-gray-400 mb-3 tracking-wide">
                AMOUNT
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 bg-gray-900 border border-gray-800 hover:border-cyan-500 rounded-lg flex items-center justify-center transition-colors"
                >
                  <span className="text-xl">−</span>
                </button>
                <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 bg-gray-900 border border-gray-800 hover:border-cyan-500 rounded-lg flex items-center justify-center transition-colors"
                >
                  <span className="text-xl">+</span>
                </button>
              </div>
            </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={!item || item.Stock === 0 || added}
                      className={`w-full py-5 rounded-lg font-bold text-lg tracking-wide transition-all duration-300 flex items-center justify-center gap-3
                        ${added
                          ? 'bg-cyan-600 text-white'
                          : !item || item.Stock === 0
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            : 'bg-cyan-500 hover:bg-cyan-600 text-black'
                        }`}
                    >
                      <ShoppingCart className="w-6 h-6" />
                      {added ? 'ADDED TO CART!!' : item?.Stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
                    </button>
             <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4 p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
                <Truck className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-white mb-1">Free Shipping</h3>
                  <p className="text-sm text-gray-400">On purchases over $50,000</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
                <CreditCard className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-white mb-1">Secure Payment</h3>
                  <p className="text-sm text-gray-400">All transactions are secure and encrypted</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
                <Package className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-white mb-1">Warranty</h3>
                  <p className="text-sm text-gray-400">30-day warranty on all products</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;