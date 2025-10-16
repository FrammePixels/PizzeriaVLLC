import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';

const ItemDetails = () => {
  const { user, token, addToShop } = useAuth();
  const { id } = useParams();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://prickly-milli-cheanime-b581b454.koyeb.app/api/products/${id}`, {
          headers: { Authorization: token ? `Bearer ${token}` : '' },
        });
        if (!res.ok) throw new Error('Error al obtener el producto');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, token]);

  const handleQuantityChange = (type) => {
    setQuantity((prev) => (type === 'increment' ? prev + 1 : Math.max(1, prev - 1)));
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      id: product.id || product._id,
      name: product.name,
      price: Number(product.price),
      quantity,
      image: product.images?.[0] || '/placeholder.jpg',
    };

    addToShop(cartItem);
    alert(`✅ ${product.name} agregado al carrito!`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-cyan-400">Cargando producto...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-black text-red-500">{error}</div>;
  if (!product) return null;

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            {product.images?.length > 0 && (
              <img src={product.images[selectedImage]} alt={product.name} className="w-full h-96 object-cover" />
            )}
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-black">{product.name}</h1>
            <div className="flex gap-4 py-4">
              <span className="text-4xl font-bold">${product.price}</span>
            </div>
            <div className="flex items-center gap-4 py-4">
              <span>Cantidad:</span>
              <div className="flex items-center border-2 border-gray-700">
                <button onClick={() => handleQuantityChange('decrement')}>-</button>
                <span className="px-4">{quantity}</span>
                <button onClick={() => handleQuantityChange('increment')}>+</button>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
