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
      // Fetch directo
      const response = await fetch(`http://localhost:4019/api/productos/${id}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const productData = await response.json();

      if (productData && Object.keys(productData).length > 0) {
        setItem(productData);
      } else {
        // Si no encuentra, fallback a todos
        await fetchFromAllProducts(id);
      }
    } catch (err) {
      await fetchFromAllProducts(id);
    } finally {
      setLoading(false); // 🔹 Asegurarse de siempre terminar loading
    }
  };

  const fetchFromAllProducts = async (productId) => {
    try {
      const allResponse = await fetch('http://localhost:4019/api/productos');
      if (!allResponse.ok) throw new Error('Error al cargar los productos');
      const productos = await allResponse.json();

      const rawProduct = productos.find(
        (p) =>
          p.ProductoId == productId ||
          p.id == productId ||
          p.ProductId == productId
      );

      if (rawProduct) {
        setItem(rawProduct);
      } else {
        setError('Producto no encontrado');
      }
    } catch (err) {
      setError('Error al cargar el producto');
    }
  };

  fetchData();
}, [id]);


  const handleAddToCart = () => {
    if (item) {
      const productToAdd = {
        id: item.ProductoId || item.ProductId || item.id,
        name: item.nombre || item.NombreProducto || item.name,
        price: item.precio || item.Precio || item.price,
        image: item.imagen || item.Imagen || item.image,
        quantity: quantity,
        stock: item.stock || item.Stock || 0
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
          <p className="text-gray-400 text-sm tracking-wider">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-red-950 border border-red-500 rounded-lg p-8 max-w-md text-center">
          <p className="text-red-400 text-lg mb-4">❌ {error}</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 max-w-md text-center">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-4">Producto no disponible</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Volver a productos
          </button>
        </div>
      </div>
    );
  }

  // ✅ Propiedades compatibles con el backend
  const productName = item.nombre || item.NombreProducto || item.name || 'Producto sin nombre';
  const productDescription = item.descripcion || item.Descripcion || item.description || 'Descripción no disponible';
  const productPrice = item.precio || item.Precio || item.price || 0;
  const productImage = item.imagen || item.Imagen || item.image;
  const productStock = item.stock || item.Stock || 0;
  const productCategory = item.categoria || item.category || 'General';
  const productId = item.ProductoId || item.ProductId || item.id;

  // Verificar si hay stock
  const hasStock = productStock > 0;
  const canAddMore = quantity < productStock;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        {/* Migas de pan */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <span>Home</span>
          <ChevronRight className="w-4 h-4" />
          <span>Products</span> 
          <ChevronRight className="w-4 h-4" />
          {productCategory && (
            <>
              <span className="capitalize">{productCategory}</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
          <span className="text-white truncate max-w-xs">{productName}</span>
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
                      className="w-full h-full object-contain max-h-96"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x400/1a1a1a/666666?text=Imagen+No+Disponible';
                        e.target.className = 'w-32 h-32 object-contain opacity-50';
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-600">
                      <Package className="w-32 h-32 mb-4" />
                      <span className="text-sm">Imagen no disponible</span>
                    </div>
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
                hasStock 
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' 
                  : 'bg-red-500/40 border-red-500 text-red-400 '
              }`}>
                {hasStock ? `Stock: ${productStock} unidades` : 'NOT  STOCK'}
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
                  ${productPrice.toLocaleString()}
                </span>
                {item.precio_original && item.precio_original !== productPrice && (
                  <span className="text-2xl line-through text-gray-500">
                    ${item.precio_original.toLocaleString()}
                  </span>
                )}
                <span className="text-gray-500 text-lg">USD</span>
              </div>
              {item.en_oferta && (
                <div className="mt-2">
                  <span className="bg-red-500 text-white px-3 py-1 text-sm font-bold rounded-full">
                    Offerts Available!
                  </span>
                </div>
              )}
            </div>

            {/* Cantidad - Solo mostrar si hay stock */}
            {hasStock && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3 tracking-wide">
                   quantity
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 bg-gray-900 border border-gray-800 hover:border-cyan-500 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <span className="text-xl">−</span>
                  </button>
                  <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(productStock, quantity + 1))}
                    className="w-12 h-12 bg-gray-900 border border-gray-800 hover:border-cyan-500 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                    disabled={!canAddMore}
                  >
                    <span className="text-xl">+</span>
                  </button>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Max: {productStock} stock available
                </p>
              </div>
            )}

            {/* Botón agregar al carrito */}
            <button
              onClick={handleAddToCart}
              disabled={!hasStock || added}
              className={`w-full py-5 rounded-lg font-bold text-lg tracking-wide transition-all duration-300 flex items-center justify-center gap-3
                ${added
                  ? 'bg-green-600 text-white'
                  : !hasStock
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-cyan-500 hover:bg-cyan-600 text-black hover:scale-105'
                }`}
            >
              <ShoppingCart className="w-6 h-6" />
              {added ? 'ADDED TO CART! ✅' : !hasStock ? 'NOT  STOCK' : `ADD TO CART - $${(productPrice * quantity).toLocaleString()}`}
            </button>

            {/* Información adicional */}
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4 p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
                <Truck className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-white mb-1">Free Shipping  </h3>
                  <p className="text-sm text-gray-400">For purchases greater than $50,000</p>
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
                  <p className="text-sm text-gray-400">30 day warranty on all products</p>
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