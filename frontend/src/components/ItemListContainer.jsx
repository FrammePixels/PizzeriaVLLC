    import { useEffect, useState } from "react";
    import ItemList from "./ItemList";
    import ProductsHandler from "./ProductsHandler";
    export default function ItemListContainer({ showHeader = true }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getProducts = async () => {
        try {
            const res = await fetch("http://localhost:4019/api/productos");  
            if (!res.ok) throw new Error("Error al obtener productos");
            const data = await res.json();

            const itemsWithIcons = data.map((item) => ({
            ...item,
            stats: item.stats?.map((stat) => {
                let icon;
                switch (stat.label) {
                case "CPU":
                    icon = <Cpu className="w-4 h-4 text-cyan-400" />;
                    break;
                case "Shield":
                    icon = <Shield className="w-4 h-4 text-red-400" />;
                    break;
                case "Power":
                    icon = <Zap className="w-4 h-4 text-yellow-400" />;
                    break;
                default:
                    icon = <Eye className="w-4 h-4 text-red-400" />;
                }
                return { ...stat, icon };
            }),
            }));

            setProducts(itemsWithIcons);
        } catch (error) {
            console.error("Error al obtener productos:", error);
        } finally {
            setLoading(false);
        }
        };

        getProducts();
    }, []);

    if (loading) {
        return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-cyan-400 text-xl font-mono animate-pulse">
            Loading...
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
