import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ItemList = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:4019/api/products', {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      
      if (!res.ok) throw new Error('Error al cargar productos');
      const data = await res.json();
      
      console.log('📦 Productos cargados en ItemList:', data.map(p => ({
        ProductoId: p.ProductoId,
        id: p.id,
        nombre: p.NombreProducto || p.nombre
      })));
      
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-cyan-400">Cargando productos...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-black text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-center mb-12 text-cyan-400">NUESTROS PRODUCTOS</h1>
        
        {/* ✅ DEBUG: Mostrar IDs para diagnóstico */}
        <div className="mb-6 p-4 bg-gray-900 rounded-lg">
          <details>
            <summary className="cursor-pointer text-cyan-400">🔍 Debug IDs de Productos</summary>
            <div className="mt-2 text-xs font-mono">
              {products.map((product, index) => (
                <div key={index} className="border-b border-gray-700 py-1">
                  Índice: {index} | ProductoId: {product.ProductoId} | id: {product.id} | Nombre: {product.NombreProducto || product.nombre}
                </div>
              ))}
            </div>
          </details>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => {
            // ✅ CORREGIDO: Usar el ID correcto del producto
            const productId = product.ProductoId || product.id;
            
            if (!productId) {
              console.error('❌ Producto sin ID:', product);
              return null;
            }

            console.log(`🔗 Generando enlace: Índice ${index} → ID ${productId} → Nombre: ${product.NombreProducto || product.nombre}`);

            return (
              <div key={productId} className="bg-gray-900 rounded-xl overflow-hidden border-2 border-gray-800 hover:border-cyan-500 transition-all duration-300 hover:scale-105">
                <Link to={`/item/${productId}`}>
                  <div className="relative">
                    <img 
                      src={product.Imagen || product.imagen || product.image} 
                      alt={product.NombreProducto || product.nombre || product.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder.jpg';
                        e.target.className = 'w-full h-48 object-contain bg-gray-800 p-4';
                      }}
                    />
                    
                    {/* ✅ Mostrar el ID en la tarjeta para debug */}
                    <div className="absolute top-2 left-2 bg-black/80 text-cyan-400 text-xs px-2 py-1 rounded">
                      ID: {productId}
                    </div>
                    
                    {/* Status badge */}
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${
                      (product.status || product.Status || 'Not Available').toLowerCase() === 'available' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {product.status || product.Status || 'N/A'}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2">
                      {product.NombreProducto || product.nombre || product.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {product.Descripcion || product.descripcion || product.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-cyan-400">
                        ${product.Precio || product.precio || product.price}
                      </span>
                      
                      {product.precio_original && product.precio_original !== product.Precio && (
                        <span className="text-sm line-through text-gray-500">
                          ${product.precio_original}
                        </span>
                      )}
                    </div>

                    {/* ✅ Información adicional de debug */}
                    <div className="mt-2 text-xs text-gray-500">
                      Stock: {product.Stock || product.stock || 0} | 
                      Estado: {product.Estado || product.estado || 'N/A'}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* ✅ Resumen de debug */}
        <div className="mt-8 p-4 bg-cyan-900/20 rounded-lg border border-cyan-700">
          <h3 className="text-cyan-400 font-bold mb-2">📊 Resumen de Productos</h3>
          <div className="text-sm">
            <p>Total productos: <strong>{products.length}</strong></p>
            <p>IDs únicos encontrados: <strong>{new Set(products.map(p => p.ProductoId || p.id)).size}</strong></p>
            <p>Productos con ProductoId: <strong>{products.filter(p => p.ProductoId).length}</strong></p>
            <p>Productos con id: <strong>{products.filter(p => p.id).length}</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemList;