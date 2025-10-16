import React, { useState, useEffect } from "react";
import { Zap, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ItemCard = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleAcquire = () => {
    if (item.ProductoId || item.id) {
      navigate(`/products/${item.ProductoId || item.id}`);
    } else {
      alert('Product not available right now');
    }
  };

  // ✅ Usar propiedades compatibles con el backend
  const productName = item.nombre || item.NombreProducto || item.name;
  const productImage = item.imagen || item.Imagen || item.image;
  const productPrice = item.precio || item.Precio || item.price;
  const productStock = item.stock || item.Stock;
  const productId = item.ProductoId || item.id;
  const productStatus = item.status || (productStock === 0 ? "Not Available" : "Available");

  return (
    <div
      className="relative bg-black border-2 border-cyan-500 rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:border-red-500 hover:shadow-2xl hover:shadow-pink-500/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxShadow: isHovered
          ? "0 0 30px rgba(236, 72, 153, 0.6), inset 0 0 20px rgba(6, 182, 212, 0.2)"
          : "0 0 15px rgba(6, 182, 212, 0.4)",
      }}
    >
      <div className="absolute top-3 right-3 z-10">
        <span
          className={`${
            productStatus?.toLowerCase() === "not available" || productStock === 0
              ? "bg-red-600 text-white"
              : "bg-cyan-500 text-black"
          } text-xs font-bold px-2 py-1 rounded uppercase tracking-wider animate-pulse`}
        > 
          {productStatus}
        </span>
      </div>

      <div className="relative h-48 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
        <img
          src={productImage || '/placeholder.jpg'}
          alt={productName || 'Producto'}
          className="w-full h-full object-cover transition-all duration-500"
          style={{
            filter: isHovered
              ? "brightness(1.2) saturate(1.5)"
              : "brightness(0.8) saturate(1.2)",
          }}
          onError={(e) => {
            e.target.src = '/placeholder.jpg';
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.1) 0px, rgba(0, 0, 0, 0.1) 1px, transparent 1px, transparent 2px)",
          }}
        />
      </div>

      <div className="p-4 relative">
        <h3 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 uppercase tracking-wide">
          {productName || 'Producto Sin Nombre'}
        </h3>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {item.stats?.map((stat, idx) => (
            <div
              key={idx}
              className="flex items-center space-x-2 bg-gray-900/50 border border-cyan-500/30 rounded px-2 py-1"
            >
              {stat.icon}
              <div className="flex-1">
                <div className="text-xs text-gray-400 uppercase">{stat.label}</div>
                <div className="text-sm font-bold text-cyan-400">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-pink-500">
              ${productPrice || '0.00'}
            </div>
            {item.precio_original && item.precio_original !== productPrice && (
              <div className="text-sm line-through text-gray-400">
                ${item.precio_original}
              </div>
            )}
          </div>
          <button
            onClick={handleAcquire}
            disabled={!productId || productStock === 0}
            className={`bg-gradient-to-r from-blue-500 to-cyan-600 text-black font-bold px-6 py-2 rounded uppercase tracking-wide transition-all duration-300
              ${!productId || productStock === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-cyan-500/90 hover:scale-110'}
            `}
          >
            View Product
          </button>
        </div>

        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-cyan-500" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-pink-500" />
      </div>
    </div>
  );
};

export default function ItemList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("🔄 Obteniendo productos...");
        const res = await fetch("https://prickly-milli-cheanime-b581b454.koyeb.app/api/products");
        if (!res.ok) throw new Error("Error al obtener productos");
        const data = await res.json();

        console.log("📦 Datos del backend:", data);

        if (Array.isArray(data)) {
          const formattedProducts = data.map((item) => ({
            ...item,
            // ✅ Mantener todas las propiedades originales del backend
            id: item.ProductoId || item.id,
            ProductoId: item.ProductoId || item.id,
            name: item.nombre || item.NombreProducto || item.name,
            price: item.precio || item.Precio || item.price,
            image: item.imagen || item.Imagen || item.image,
            description: item.descripcion || item.Descripcion || item.description,
            stock: item.stock || item.Stock,
            category: item.categoria || item.category,
            en_oferta: item.en_oferta,
            precio_original: item.precio_original,
            
            // ✅ Stats mejoradas
            stats: [
              {
                label: "Stock",
                value: `${item.stock || item.Stock || 0} units`,
                icon: <Zap className="w-4 h-4 text-yellow-400" />
              },
              {
                label: "Category",
                value: item.categoria || item.category || "General",
                icon: <Shield className="w-4 h-4 text-cyan-400" />
              },
              {
                label: "Status",
                value: (item.stock || item.Stock) > 0 ? "Available" : "Out of Stock",
                icon: <Shield className="w-4 h-4 text-green-400" />
              },
              {
                label: "Offer",
                value: item.en_oferta ? "Special" : "Regular",
                icon: <Zap className="w-4 h-4 text-pink-400" />
              }
            ].filter(stat => stat.value) // Filtrar stats vacías
          }));

          setProducts(formattedProducts);
          console.log(`✅ ${formattedProducts.length} productos formateados`);
        } else {
          console.warn('❌ Se esperaba array pero se recibió:', data);
          setProducts([]);
        }
      } catch (err) {
        console.error("❌ Error:", err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400 font-mono animate-pulse">CARGANDO PRODUCTOS...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400 font-mono">ERROR: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ItemCard key={product.ProductoId || product.id} item={product} />
        ))}
      </div>

      {products.length === 0 && !loading && (
        <div className="text-center text-cyan-400 font-mono mt-12">
          NO PRODUCTS AVAILABLE
        </div>
      )}
    </div>
  );
}