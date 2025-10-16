import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';

const ItemDetails = () => {
  const { user, token, addToShop } = useAuth();
  const { id } = useParams(); // ✅ id está bien definido aquí

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('🔍 Fetching product with ID:', id); // Para debug
        const res = await fetch(`https://prickly-milli-cheanime-b581b454.koyeb.app/api/products/${id}`, {
          headers: { Authorization: token ? `Bearer ${token}` : '' },
        });
        if (!res.ok) throw new Error('Error al obtener el producto');
        const data = await res.json();
        console.log('📦 Product data:', data); // Para debug
        setProduct(data);
      } catch (err) {
        console.error('❌ Error fetching product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) { // ✅ Verificar que id existe antes de hacer fetch
      fetchProduct();
    } else {
      setError('ID del producto no especificado');
      setLoading(false);
    }
  }, [id, token]);

  const handleQuantityChange = (type) => {
    setQuantity((prev) => (type === 'increment' ? prev + 1 : Math.max(1, prev - 1)));
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      id: product.ProductoId || product.id || product._id, // ✅ CORREGIDO: Usar ProductoId
      name: product.nombre || product.name, // ✅ También corregir nombre
      price: Number(product.precio || product.price),
      quantity,
      image: product.imagen || product.images?.[0] || '/placeholder.jpg', // ✅ Corregir imagen
    };

    addToShop(cartItem);
    alert(`✅ ${product.nombre || product.name} agregado al carrito!`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-cyan-400">Cargando producto...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-black text-red-500">Error: {error}</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center bg-black text-red-500">Producto no encontrado</div>;

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <img 
              src={product.imagen || product.images?.[0]} 
              alt={product.nombre || product.name} 
              className="w-full h-96 object-cover" 
            />
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-black">{product.nombre || product.name}</h1>
            <p className="text-gray-300">{product.descripcion || product.description}</p>
            
            <div className="flex gap-4 py-4">
              {product.precio_original && product.precio_original !== product.precio ? (
                <>
                  <span className="text-4xl font-bold text-cyan-400">${product.precio}</span>
                  <span className="text-2xl line-through text-gray-500">${product.precio_original}</span>
                </>
              ) : (
                <span className="text-4xl font-bold">${product.precio || product.price}</span>
              )}
            </div>

            <div className="flex items-center gap-4 py-4">
              <span>Cantidad:</span>
              <div className="flex items-center border-2 border-gray-700">
                <button 
                  onClick={() => handleQuantityChange('decrement')}
                  className="px-3 py-1 hover:bg-gray-800"
                >
                  -
                </button>
                <span className="px-4">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange('increment')}
                  className="px-3 py-1 hover:bg-gray-800"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="bg-cyan-500 px-6 py-3 font-bold rounded-xl hover:bg-cyan-600 transition"
              >
                Add to Cart
              </button>
            </div>

            {/* Información adicional */}
            <div className="mt-6 space-y-2">
              <p><strong>Categoría:</strong> {product.categoria || product.category}</p>
              <p><strong>Stock:</strong> {product.stock} unidades</p>
              {product.en_oferta && (
                <p className="text-green-400 font-bold">🎯 EN OFERTA</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;