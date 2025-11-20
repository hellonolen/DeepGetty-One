import React, { useState } from 'react';
import { Product } from '../types';
import { ArrowRight, Trash2, ShieldCheck, CreditCard } from 'lucide-react';

interface CartProps {
  items: Product[];
  onRemove: (index: number) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onRemove, onCheckout }) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 0 ? 15 : 0;
  const total = subtotal + tax + shipping;

  if (items.length === 0 && !isCheckingOut) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center animate-in fade-in">
        <h2 className="text-3xl font-serif font-bold text-white mb-4">Your Gear is Empty</h2>
        <p className="text-gray-500">Equip yourself for the discipline.</p>
      </div>
    );
  }

  if (isCheckingOut) {
    return (
      <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-right">
        <h1 className="text-3xl font-serif font-bold text-white mb-8">Secure Checkout</h1>
        
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl mb-6">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-zinc-800">
            <span className="text-gray-400">Order Total</span>
            <span className="text-2xl font-bold text-white">${total.toFixed(2)}</span>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Shipping Address</label>
              <input type="text" placeholder="123 Deep St, New York, NY" className="w-full bg-black border border-zinc-700 text-white p-3 rounded-xl" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Payment Method</label>
              <div className="relative">
                 <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                 <input type="text" placeholder="•••• •••• •••• 4242" className="w-full bg-black border border-zinc-700 text-white p-3 pl-12 rounded-xl" />
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={onCheckout}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
        >
          Complete Order <ShieldCheck className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setIsCheckingOut(false)}
          className="w-full text-gray-500 text-sm mt-4 hover:text-white"
        >
          Back to Cart
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      <h1 className="text-4xl font-serif font-bold text-white mb-8">Cart ({items.length})</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="flex items-center justify-between bg-zinc-900 p-4 rounded-xl border border-zinc-800">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-black" />
                <div>
                  <h3 className="font-bold text-white">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <p className="font-medium text-white mt-1">${item.price}</p>
                </div>
              </div>
              <button onClick={() => onRemove(idx)} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl sticky top-24">
            <h3 className="text-xl font-bold text-white mb-6">Summary</h3>
            <div className="space-y-3 text-sm text-gray-400 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax</span>
                <span className="text-white">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-white">${shipping.toFixed(2)}</span>
              </div>
              <div className="border-t border-zinc-800 pt-3 flex justify-between text-lg font-bold text-white">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={() => setIsCheckingOut(true)}
              className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;