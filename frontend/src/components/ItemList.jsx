import React, { useState, useEffect } from "react";
import { Zap, Shield, Cpu, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ItemCard = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleAcquire = () => {
    if (item.ProductoId) {
      navigate(`/productos/${item.ProductoId}`);
    } else {
      console.error('ProductoId no válido:', item.ProductoId);
      alert('Producto no disponible temporalmente');
    }
  };

  return (
    <div
      className="relative bg-black border-2 border-cyan-500 rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:border-pink-500 hover:shadow-2xl hover:shadow-pink-500/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxShadow: isHovered
          ? "0 0 30px rgba(236, 72, 153, 0.6), inset 0 0 20px rgba(6, 182, 212, 0.2)"
          : "0 0 15px rgba(6, 182, 212, 0.4)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-pink-500/10 pointer-events-none" />
      <div className="absolute top-3 right-3 z-10">
        <span className="bg-cyan-500 text-black text-xs font-bold px-2 py-1 rounded uppercase tracking-wider animate-pulse">
          {item.status || "Disponible"}
        </span>
      </div>

      <div className="relative h-48 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
        <img
          src={item.Imagen || item.image}
          alt={item.NombreProducto || 'Producto'}
          className="w-full h-full object-cover transition-all duration-500"
          style={{
            filter: isHovered
              ? "brightness(1.2) saturate(1.5)"
              : "brightness(0.8) saturate(1.2)",
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
          {item.NombreProducto || 'Producto'}
        </h3>

        <p className="text-cyan-300 text-sm mb-3 font-mono uppercase tracking-wider">
          {item.Categoria || item.category || 'Categoría'}
        </p>

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
              ${item.Precio || item.price || '0.00'}
            </div>
          </div>
          <button 
            onClick={handleAcquire}
            className="bg-gradient-to-r from-cyan-500 to-pink-500 text-black font-bold px-6 py-2 rounded uppercase tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/50 hover:scale-110"
          >
            Adquirir
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:4019/api/productos");
        if (!res.ok) throw new Error("Error al obtener productos");
        const data = await res.json();

        console.log("Datos del backend:", data);

        if (Array.isArray(data)) {
          const formattedProducts = data.map((item) => ({
            ...item,
            id: item.ProductoId,
            ProductoId: item.ProductoId,
            name: item.NombreProducto,
            price: item.Precio,
            image: item.Imagen,
            description: item.Descripcion,
            stats: [
              {
                label: "Stock",
                value: item.Stock || "Disponible",
                icon: <Zap className="w-4 h-4 text-yellow-400" />
              },
              {
                label: "Categoría", 
                value: item.Categoria || "General",
                icon: <Shield className="w-4 h-4 text-pink-400" />
              }
            ]
          }));

          setProducts(formattedProducts);
        } else {
          console.warn('Expected array but got:', data);
          setProducts([]);
        }
      } catch (err) {
        console.error(err);
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
        <div className="text-cyan-400 font-mono">CARGANDO PRODUCTOS...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 uppercase tracking-widest">
          Cyber Market 2077
        </h1>
        <p className="text-cyan-300 font-mono text-lg">
          // Equipamiento de última generación para operadores cibernéticos
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ItemCard key={product.ProductoId} item={product} />
        ))}
      </div>

      {products.length === 0 && !loading && (
        <div className="text-center text-cyan-400 font-mono mt-12">
          NO HAY PRODUCTOS DISPONIBLES
        </div>
      )}
    </div>
  );
}