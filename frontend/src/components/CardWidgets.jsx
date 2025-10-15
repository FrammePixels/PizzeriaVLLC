import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; 

const CardWidgets = () => {
  const { bgCounts } = useAuth();
  const itemCount = bgCounts();

  return (
    <Link to="/Cart" className="relative inline-block no-underline">
      <div className="relative p-3 transition-all duration-300 hover:scale-110">
        <div className="relative">
          <FaShoppingCart className="text-2xl text-gray-700 hover:text-indigo-600 transition-colors duration-300" />
          
          {itemCount > 0 && (
            <span className={`
              absolute -top-2 -right-2 min-w-[24px] h-6 px-1.5 
              flex items-center justify-center
              text-xs font-bold text-white 
              bg-gradient-to-r from-red-500 to-pink-500
              rounded-full 
              border-2 border-white
              shadow-lg
              animate-pulse
              transition-all duration-300
              ${itemCount > 99 ? 'text-[10px]' : ''}
            `}>
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          )}
        </div>
        
         <div className="absolute inset-0 rounded-full bg-indigo-200 opacity-0 hover:opacity-20 blur-md transition-opacity duration-300"></div>
      </div>
    </Link>
  );
}

export default CardWidgets;