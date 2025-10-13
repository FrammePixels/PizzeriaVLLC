import { useEffect, useState } from "react";
import ItemList from "./ItemList";

export default function ItemListContainer({ showHeader = true }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/products')
        .then(response => response.json())
        .then(data => {
            setProducts(data);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error:', error);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-cyan-400 text-xl font-mono animate-pulse">
                    LOADING_CYBER_DATA...
                </div>
            </div>
        );
    }

    return (
        <div>
            {showHeader && (
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-2 p-5">
                        CYBER_ITEM_DATABASE
                    </h1>
                    <div className="h-1 bg-gradient-to-r from-cyan-500 to-purple-500 w-32 mx-auto"></div>
                </div>
            )}
            <ItemList items={products} />
        </div>
    );
}