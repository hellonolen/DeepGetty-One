import React from 'react';
import { PRODUCTS } from '../constants';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface MerchProps {
  addToCart: (product: Product) => void;
  onNavigateToCart: () => void;
  cartCount: number;
}

const Merch: React.FC<MerchProps> = ({ addToCart, onNavigateToCart, cartCount }) => {
  return (
    <div className="animate-in fade-in duration-500 relative">
      <div className="flex justify-between items-start mb-12">
        <div className="text-center flex-1">
           <h1 className="text-5xl font-serif font-bold text-white mb-4">Deep Getty <span className="italic font-light text-gray-400">Gear</span></h1>
           <p className="text-gray-400">Engineered for the discipline.</p>
        </div>
        <button 
          onClick={onNavigateToCart}
          className="absolute right-0 top-0 p-3 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors relative group"
        >
           <ShoppingCart className="w-5 h-5 text-white group-hover:text-blue-400" />
           {cartCount > 0 && (
             <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs font-bold flex items-center justify-center rounded-full">
               {cartCount}
             </span>
           )}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {PRODUCTS.map(product => (
          <div key={product.id} className="group">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-900 mb-4 cursor-pointer">
              <img 
                src={product.image} 
                alt={product.name} 
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white">
                ${product.price}
              </div>
              
              {/* Quick Add Button Overlay */}
              <button 
                onClick={() => addToCart(product)}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-2 rounded-full font-bold text-sm opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 shadow-xl"
              >
                Add to Cart
              </button>
            </div>
            
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{product.category}</p>
                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors cursor-pointer">{product.name}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Merch;