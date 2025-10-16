// En cualquier componente donde agregues productos:
import { useAuth } from '../context/AuthContext';

function ProductCard({ product }) {
  const { addToShop } = useAuth();

  const handleAddToCart = () => {
    // Asegúrate de que el producto tenga ID
    const productToAdd = {
      id: product.id, // ← ESTO ES OBLIGATORIO
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    };
    
    addToShop(productToAdd);
  };

  return (
    <button 
      onClick={handleAddToCart}
      className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
    >
      Agregar al Carrito
    </button>
  );
}