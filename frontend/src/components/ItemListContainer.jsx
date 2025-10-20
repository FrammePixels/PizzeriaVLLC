import { useEffect, useState } from "react";
import ItemList from "./ItemList";
import ProductsHandler from "./ProductsHandler";
import { Cpu, Shield, Zap, Eye } from "lucide-react";

export default function ItemListContainer({ showHeader = true }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:4019/api/productos");

        if (!res.ok) {
          throw new Error(`Error ${res.status}: No se pudo obtener productos`);
        }

        const data = await res.json();

        // ✅ Mapeo de propiedades del backend al frontend
        const itemsWithIcons = data.map((item) => ({
          ...item,
          id: item.ProductoId || item.id,
          name: item.nombre || item.name,
          price: item.precio || item.price,
          originalPrice: item.precio_original || item.originalPrice,
          description: item.descripcion || item.description,
          category: item.categoria || item.category,
          image: item.imagen || item.image,
          inOffer: item.en_oferta || item.inOffer,
          stock: item.stock || 0,
          stats: item.stats || generateDefaultStats(item),
        }));

        setProducts(itemsWithIcons);
      } catch (err) {
        setError(err.message || "Error desconocido al cargar productos");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  // ✅ Generador de stats predeterminadas
  const generateDefaultStats = (product) => {
    const stats = [];

    if (product.categoria) {
      stats.push({
        label: "Category",
        value: product.categoria,
        icon: <Eye className="w-4 h-4 text-cyan-400" />,
      });
    }

    if (product.en_oferta) {
      stats.push({
        label: "Offer",
        value: "Special Price",
        icon: <Zap className="w-4 h-4 text-yellow-400" />,
      });
    }

    if (product.stock > 0) {
      stats.push({
        label: "Stock",
        value: `${product.stock} units`,
        icon: <Shield className="w-4 h-4 text-green-400" />,
      });
    }

    if (stats.length === 0) {
      stats.push({
        label: "Quality",
        value: "Premium",
        icon: <Cpu className="w-4 h-4 text-cyan-400" />,
      });
    }

    return stats;
  };

  // ✅ Estado de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400 text-xl font-mono animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  // ✅ Estado de error
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400 text-xl font-mono">
          Error: {error}
        </div>
      </div>
    );
  }

  // ✅ Render final
  return (
    <div>
      {showHeader && <ProductsHandler />}
      <ItemList items={products} />
    </div>
  );
}
