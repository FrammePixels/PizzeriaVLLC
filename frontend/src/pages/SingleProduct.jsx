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
        console.log('🔍 Buscando producto con ID:', id);
        
        // ✅ CORREGIDO: Usar el endpoint específico para un producto
        const response = await fetch(`https://prickly-milli-cheanime-b581b454.koyeb.app/api/products/${id}`);
        
        if (!response.ok) {
          // Si no encuentra por ID específico, buscar en la lista general
          const allResponse = await fetch('https://prickly-milli-cheanime-b581b454.koyeb.app/api/products');
          if (!allResponse.ok) throw new Error('Error al cargar los productos');
          
          const productos = await allResponse.json();
          const rawProduct = productos.find(p => p.ProductoId === id);
          
          if (rawProduct) {
            setItem(rawProduct);
          } else {
            setError('Producto no encontrado');
          }
        } else {
          const productData = await response.json();
          setItem(productData);
        }
      } catch (err) {
        console.error('❌ Error fetching data:', err);
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddToCart = () => {
    if (item) {
      const productToAdd = {
        id: item.ProductoId || item.id,
        name: item.nombre || item.NombreProducto || item.name,
        price: item.precio || item.Precio || item.price,
        image: item.imagen || item.Imagen || item.image,
        quantity: quantity,
        stock: item.stock || item.Stock
      };
      
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

  // ✅ Propiedades compatibles con el backend
  const productName = item.nombre || item.NombreProducto || item.name;
  const productDescription = item.descripcion || item.Descripcion || item.description;
  const productPrice = item.precio || item.Precio || item.price;
  const productImage = item.imagen || item.Imagen || item.image;
  const productStock = item.stock || item.Stock;
  const productCategory = item.categoria || item.category;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <span>Home</span>
          <ChevronRight className="w-4 h-4" />
          <span>Products</span> 
          <ChevronRight className="w-4 h-4" />
          {productCategory && (
            <>
              <span>{productCategory}</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
          <span className="text-white">{productName}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Imagen del producto */}
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                <div className="aspect-square flex items-center justify-center p-8">
                  {productImage ? (
                    <img 
                      src={productImage} 
                      alt={productName} 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = '/placeholder.jpg';
                        e.target.className = 'w-32 h-32 object-contain opacity-50';
                      }}
                    />
                  ) : (
                    <Package className="w-32 h-32 text-gray-700" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Información del producto */}
          <div className="space-y-8">
            {/* Stock */}
            <div className="inline-block">
              <span className={`px-4 py-1.5 border text-xs font-bold tracking-wider rounded-full ${
                productStock > 0 
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' 
                  : 'bg-red-500/10 border-red-500 text-red-400'
              }`}>
                {productStock > 0 ? `Stock: ${productStock} units` : 'OUT OF STOCK'}
              </span>
            </div>

            {/* Nombre y descripción */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
                {productName}
              </h1>
              {productDescription && (
                <p className="text-gray-400 text-lg leading-relaxed">
                  {productDescription}
                </p>
              )}
            </div>

            {/* Precio */}
            <div className="border-t border-b border-gray-800 py-6">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold text-cyan-400">
                  ${productPrice}
                </span>
                {item.precio_original && item.precio_original !== productPrice && (
                  <span className="text-2xl line-through text-gray-500">
                    ${item.precio_original}
                  </span>
                )}
                <span className="text-gray-500 text-lg">ARS</span>
              </div>
              {item.en_oferta && (
                <div className="mt-2">
                  <span className="bg-red-500 text-white px-3 py-1 text-sm font-bold rounded-full">
                    🎯 EN OFERTA
                  </span>
                </div>
              )}
            </div>

            {/* Cantidad */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3 tracking-wide">
                CANTIDAD
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={productStock === 0}
                  className="w-12 h-12 bg-gray-900 border border-gray-800 hover:border-cyan-500 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-xl">−</span>
                </button>
                <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(productStock, quantity + 1))}
                  disabled={productStock === 0 || quantity >= productStock}
                  className="w-12 h-12 bg-gray-900 border border-gray-800 hover:border-cyan-500 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-xl">+</span>
                </button>
              </div>
              {productStock > 0 && (
                <p className="text-sm text-gray-400 mt-2">
                  Máximo: {productStock} unidades disponibles
                </p>
              )}
            </div>

            {/* Botón agregar al carrito */}
            <button
              onClick={handleAddToCart}
              disabled={!item || productStock === 0 || added}
              className={`w-full py-5 rounded-lg font-bold text-lg tracking-wide transition-all duration-300 flex items-center justify-center gap-3
                ${added
                  ? 'bg-cyan-600 text-white'
                  : !item || productStock === 0
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-cyan-500 hover:bg-cyan-600 text-black'
                }`}
            >
              <ShoppingCart className="w-6 h-6" />
              {added ? '¡AGREGADO AL CARRITO!' : productStock === 0 ? 'SIN STOCK' : 'AGREGAR AL CARRITO'}
            </button>

            {/* Información adicional */}
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4 p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
                <Truck className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-white mb-1">Envío Gratis</h3>
                  <p className="text-sm text-gray-400">En compras mayores a $50,000</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
                <CreditCard className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-white mb-1">Pago Seguro</h3>
                  <p className="text-sm text-gray-400">Todas las transacciones son seguras y encriptadas</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
                <Package className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-white mb-1">Garantía</h3>
                  <p className="text-sm text-gray-400">30 días de garantía en todos los productos</p>
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