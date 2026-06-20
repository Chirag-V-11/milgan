"use client";
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import UserAuthModal from './UserAuthModal';

export default function CartDrawer() {
  const { cart, isOpen, setIsOpen, updateQuantity, removeFromCart, cartTotal } = useCart();
  const { user } = useUser();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    // Format WhatsApp order message
    const orderItemsText = cart
      .map(
        (item, idx) =>
          `${idx + 1}. *${item.name}* (${item.size})\n   Qty: ${item.quantity} x ₹${item.basePrice} = ₹${item.basePrice * item.quantity}`
      )
      .join('\n\n');

    const message = `*NEW ORDER RECEIVED - MILGEN FOODS* 🌾🏺

*Customer Details:*
👤 Name: ${user.name}
📞 Phone: ${user.phone}
📍 Address: ${user.address}

*Order Curation:*
${orderItemsText}

--------------------------------
💰 *Subtotal:* ₹${cartTotal}
🚚 *Shipping:* FREE
💵 *Total Payable:* ₹${cartTotal}

Thank you for choosing Milgen Foods!`;

    const text = encodeURIComponent(message);
    window.open(`https://wa.me/918660013411?text=${text}`, '_blank');
    
    setIsOpen(false);
  };

  const drawerBody = (
    <div className="fixed inset-0 w-screen h-screen z-[9999] flex justify-end font-sans">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#23212e]/70 backdrop-blur-sm cursor-pointer transition-opacity animate-in fade-in duration-300"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-[#23212e] h-full shadow-[0_0_50px_rgba(0,0,0,0.5)] border-l border-white/10 flex flex-col justify-between z-10 animate-in slide-in-from-right duration-500">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
              <span className="text-gold">🏺</span> Sanctuary Cart
            </h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
              Your curated selections
            </p>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center font-bold text-md hover:bg-gold hover:text-[#23212e] active:scale-95 transition-all shadow-md"
            title="Close Cart"
          >
            ×
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="text-5xl animate-bounce-slow">👜</div>
              <h4 className="text-base font-serif font-bold text-white/80">Your cart is empty</h4>
              <p className="text-xs text-white/50 font-serif italic max-w-[200px]">
                Explore our traditional collections to begin your wellness journey.
              </p>
              <button 
                onClick={() => setIsOpen(false)}
                className="px-6 py-2.5 bg-gold text-[#23212e] rounded-full text-[9px] font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-md border border-white/10"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div 
                key={`${item.id}-${item.size}`}
                className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl hover:border-gold/20 hover:bg-white/[0.04] transition-all duration-300 relative group"
              >
                {/* Product Image */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 flex-shrink-0 border border-white/10">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover" 
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1000"; }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1 text-left">
                  <h4 className="text-sm font-serif font-bold text-white truncate">{item.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] px-2 py-0.5 bg-white/10 rounded-full font-black text-gold uppercase tracking-widest">
                      {item.size}
                    </span>
                    <span className="text-[10px] font-black text-gold font-mono">
                      ₹{item.basePrice * item.quantity}
                    </span>
                  </div>

                  {/* Quantity Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <button 
                      onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                      className="w-6 h-6 rounded-md bg-white/5 border border-white/10 text-white flex items-center justify-center font-bold text-xs hover:bg-gold hover:text-[#23212e] active:scale-95 transition-all"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-xs font-black text-white font-mono">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                      className="w-6 h-6 rounded-md bg-white/5 border border-white/10 text-white flex items-center justify-center font-bold text-xs hover:bg-gold hover:text-[#23212e] active:scale-95 transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Delete Button */}
                <button 
                  onClick={() => removeFromCart(item.id, item.size)}
                  className="absolute top-3 right-3 text-white/30 hover:text-red-500 transition-colors text-lg"
                  title="Remove Item"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-white/[0.01] space-y-6">
            {/* Subtotal */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Subtotal</span>
                <span className="text-2xl font-serif font-bold text-gold">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-green-500">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button 
              onClick={handleCheckout}
              className="w-full py-4 bg-[#25D366] text-white hover:bg-green-600 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-lg hover:shadow-green-500/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Checkout via WhatsApp
            </button>
          </div>
        )}

      </div>

      <UserAuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onAuthenticated={handleCheckout}
      />
    </div>
  );

  return typeof document !== 'undefined' 
    ? createPortal(drawerBody, document.body) 
    : null;
}
