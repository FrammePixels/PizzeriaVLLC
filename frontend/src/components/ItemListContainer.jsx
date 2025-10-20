import { useEffect, useState } from "react";
import ItemList from "./ItemList";
import ProductsHandler from "./ProductsHandler";
import { Cpu, Shield, Zap, Eye } from 'lucide-react'; // ✅ Asegurar imports

export default function ItemListContainer({ showHeader = true }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
         const res = await fetch("http://localhost:4019/api/productos");  
        if (!res.ok) throw new Error("Error al obtener productos");
        const data = await res.json();
 
        // ✅ Mapear las propiedades del backend a las que espera el frontend
        const itemsWithIcons = data.map((item) => ({
          // Propiedades del backend
          ...item,
          // ✅ Mapear propiedades para compatibilidad
          id: item.ProductoId || item.id, // Usar ProductoId del backend como id
          name: item.nombre || item.name, // nombre → name
          price: item.precio || item.price, // precio → price
          originalPrice: item.precio_original || item.originalPrice,
          description: item.descripcion || item.description, // descripcion → description
          category: item.categoria || item.category, // categoria → category
          image: item.imagen || item.image, // imagen → image
          inOffer: item.en_oferta || item.inOffer, // en_oferta → inOffer
          stock: item.stock || item.stock,
          
          // ✅ Mantener stats si existen, sino crear algunas basadas en propiedades
          stats: item.stats || generateDefaultStats(item),
        }));

        setProducts(itemsWithIcons);
      } catch (error) {
         setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  // ✅ Función para generar stats por defecto basadas en propiedades del producto
  const generateDefaultStats = (product) => {
    const stats = [];
    
    if (product.categoria) {
      stats.push({
        label: "Category",
        value: product.categoria,
        icon: <Eye className="w-4 h-4 text-cyan-400" />
      });
    }
    
    if (product.en_oferta) {
      stats.push({
        label: "Offer",
        value: "Special Price",
        icon: <Zap className="w-4 h-4 text-yellow-400" />
      });
    }
    
    if (product.stock > 0) {
      stats.push({
        label: "Stock",
        value: `${product.stock} units`,
        icon: <Shield className="w-4 h-4 text-green-400" />
      });
    }
    
    // Agregar stat por defecto si no hay stats
    if (stats.length === 0) {
      stats.push({
        label: "Quality",
        value: "Premium",
        icon: <Cpu className="w-4 h-4 text-cyan-400" />
      });
    }
    
    return stats;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400 text-xl font-mono animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400 text-xl font-mono">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProductsHandler/>
      <ItemList items={products} />
    </div>
  );
}