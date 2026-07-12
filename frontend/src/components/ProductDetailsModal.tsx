"use client";
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useUser } from '@/context/UserContext';
import { useCart } from '@/context/CartContext';
import UserAuthModal from './UserAuthModal';
import CheckoutModal, { CheckoutData } from './CheckoutModal';
import { getApiUrl } from '@/config/api';

interface ProductDetailsModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailsModal({ product, isOpen, onClose }: ProductDetailsModalProps) {
  const { user } = useUser();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [authAction, setAuthAction] = useState<'whatsapp' | 'cart' | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (product && product.quantity_options?.length > 0) {
      setSelectedSize(product.quantity_options[0]);
      const initialQtys: Record<string, number> = {};
      product.quantity_options.forEach((opt: any) => {
        initialQtys[opt.size] = 0;
      });
      setQuantities(initialQtys);
    }
    setActiveImage(0);
  }, [product]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen || !product) return null;

  const allImages: string[] = Array.from(new Set<string>([
    ...(product.image_urls?.filter((u: string) => u?.trim()) || []),
    ...(product.image_url ? [product.image_url] : [])
  ])).filter(Boolean);

  if (allImages.length === 0) {
    allImages.push("https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1000");
  }

  const quantitiesList = product?.quantity_options?.map((opt: any) => {
    const optFinal = Math.round(opt.baseCost * (1 - (opt.discountPercentage || 0) / 100));
    const qty = quantities[opt.size] || 0;
    return {
      opt,
      qty,
      optFinal
    };
  }) || [];

  const totalPrice = quantitiesList.reduce((acc: number, item: any) => acc + (item.optFinal * item.qty), 0);
  const totalBaseCost = quantitiesList.reduce((acc: number, item: any) => acc + (item.opt.baseCost * item.qty), 0);
  const totalSavings = totalBaseCost - totalPrice;
  const totalPackages = quantitiesList.reduce((acc: number, item: any) => acc + item.qty, 0);

  const finalPrice = selectedSize
    ? Math.round(selectedSize.baseCost * (1 - (selectedSize.discountPercentage || 0) / 100))
    : 0;

  const handleWhatsAppOrder = () => {
    setBookingError('');
    setBookingSuccess(false);
    setIsCheckoutOpen(true);
  };

  const handleConfirmOrder = async (checkoutData: CheckoutData) => {
    setIsBooking(true);
    setBookingError('');
    setBookingSuccess(false);

    const activeItems = quantitiesList.filter((item: any) => item.qty > 0);
    if (activeItems.length === 0) {
      setBookingError('Please select a quantity greater than 0.');
      setIsBooking(false);
      return;
    }

    const itemText = activeItems.map((item: any) => `${item.qty}x ${item.opt.size} ${product.name}`).join(', ');
    const itemWeight = activeItems.reduce((acc: number, item: any) => {
      const numericSize = parseFloat(item.opt.size) || 0.5;
      const unitFactor = item.opt.size.toLowerCase().includes('ml') || item.opt.size.toLowerCase().includes('g') ? 0.001 : 1;
      return acc + (item.qty * numericSize * unitFactor);
    }, 0).toFixed(1);

    const payload = {
      orderId: `MLG-${Date.now()}`,
      productId: product.id || '615df5ef',
      customerName: checkoutData.name,
      mobile: checkoutData.phone,
      email: checkoutData.email || user?.email || 'customer@example.com',
      address: checkoutData.address,
      city: checkoutData.city,
      pincode: checkoutData.pincode,
      state: checkoutData.state,
      declaredValue: String(totalPrice),
      weight: String(itemWeight),
      packages: totalPackages,
      description: itemText,
      paymentMethod: checkoutData.paymentMethod === 'cod' 
        ? 'COD' 
        : (checkoutData.transactionId ? `UPI (UTR: ${checkoutData.transactionId})` : 'WhatsApp'),
    };

    try {
      const apiBase = getApiUrl();
      const response = await fetch(`${apiBase}/api/shipping/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setBookingSuccess(true);

        const orderItemText = activeItems.map((item: any, idx: number) => `${idx + 1}. *${product.name}* (${item.opt.size})\n   Qty: ${item.qty} x ₹${item.optFinal} = ₹${item.optFinal * item.qty}`).join('\n');
        const paymentDetails = checkoutData.paymentMethod === 'cod'
          ? 'Cash on Delivery (COD)'
          : checkoutData.paymentMethod === 'whatsapp'
          ? 'WhatsApp Order'
          : `UPI (UTR: ${checkoutData.transactionId || 'N/A'})`;
        const message = `*NEW ORDER RECEIVED - MILGEN FOODS* 🌾🏺\n\n*Customer Details:*\n👤 Name: ${checkoutData.name}\n📞 Phone: ${checkoutData.phone}\n📍 Address: ${checkoutData.address}, ${checkoutData.city} - ${checkoutData.pincode}, ${checkoutData.state}\n📧 Email: ${checkoutData.email || 'N/A'}\n\n*Order Curation:*\n${orderItemText}\n\n--------------------------------\n💰 *Subtotal:* ₹${totalPrice}\n🚚 *Shipping:* FREE\n💳 *Payment:* ${paymentDetails}\n💵 *Total Payable:* ₹${totalPrice}\n\nThank you for choosing Milgen Foods!`;

        const text = encodeURIComponent(message);
        window.open(`https://wa.me/918123282168?text=${text}`, '_blank');
      } else {
        setBookingError(data.error || 'Failed to register order. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setBookingError('Server unreachable. Please try again later.');
    } finally {
      setIsBooking(false);
    }
  };

  const handleAddToCart = (currentUser?: any) => {
    if (!product) return;
    let addedAny = false;
    product.quantity_options?.forEach((opt: any) => {
      const q = quantities[opt.size] || 0;
      if (q > 0) {
        const optFinal = Math.round(opt.baseCost * (1 - (opt.discountPercentage || 0) / 100));
        addToCart({
          id: product.id,
          name: product.name,
          image: allImages[0] || '',
          size: opt.size,
          basePrice: optFinal,
          originalPrice: opt.baseCost
        }, q);
        addedAny = true;
      }
    });
    if (addedAny) {
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const modalBody = (
    <div className="fixed inset-0 w-screen h-screen z-[9999] grid place-items-center p-4 sm:p-6 bg-[#23212e]/90 backdrop-blur-xl transition-all duration-500 overflow-y-auto font-sans">
      {/* Click outside to close */}
      <div className="fixed inset-0 cursor-pointer" onClick={onClose} />

      {/* Main Container */}
      <div className="relative bg-[#23212e] w-full max-w-5xl rounded-[2.5rem] sm:rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.6),0_0_80px_rgba(252,196,51,0.1)] overflow-hidden transition-all duration-700 border border-white/10 animate-in zoom-in-95 duration-500 flex flex-col lg:flex-row max-h-[90vh] lg:max-h-none">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-white/10 text-white border border-white/10 flex items-center justify-center text-xl font-bold hover:bg-gold hover:text-[#23212e] hover:scale-105 active:scale-95 transition-all shadow-lg"
          title="Close Modal"
        >
          ×
        </button>

        {/* ── LEFT: Image Gallery ── */}
        <div className="lg:w-1/2 p-6 sm:p-10 flex flex-col justify-center bg-white/[0.01] border-b lg:border-b-0 lg:border-r border-white/5 overflow-y-auto max-h-[40vh] lg:max-h-[80vh] shrink-0">
          <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-white/[0.03] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/5 group">
            <img
              src={allImages[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-[1500ms]"
              onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1000"; }}
            />
            {selectedSize?.discountPercentage > 0 && (
              <div className="absolute top-6 left-6 bg-gold text-[#23212e] text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-xl">
                {selectedSize.discountPercentage}% OFF
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1 mt-4 scrollbar-none">
              {allImages.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${activeImage === idx ? 'border-gold scale-105 shadow-md' : 'border-transparent opacity-50 hover:opacity-80'}`}
                >
                  <img src={url} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: Details & Purchases ── */}
        <div className="lg:w-1/2 p-6 sm:p-10 lg:p-12 overflow-y-auto max-h-[50vh] lg:max-h-[80vh] space-y-8 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-black text-gold uppercase tracking-[0.5em]">Artisanal Collection</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground tracking-tighter leading-tight">
                {product.name}
              </h2>
              <p className="text-foreground/60 font-serif italic text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Ingredients & Infusion Section */}
            {(product.name.toLowerCase().includes('ghee') ||
              product.name.toLowerCase().includes('butter') ||
              product.name.toLowerCase().includes('makhan') ||
              product.name.toLowerCase().includes('evning') ||
              product.description.toLowerCase().includes('ghee') ||
              product.description.toLowerCase().includes('butter')) && (
                <div className="space-y-3 pt-5 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-gold uppercase tracking-[0.3em]">The Alchemy of Infusion</span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>
                  <p className="text-foreground/70 text-[11px] leading-relaxed font-serif italic">
                    Clarified using pure Cow Butter, infused with traditional elements during slow cooking to enrich aroma, shelf-life, and wellness:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Elachi', icon: '🏺', detail: 'Digestion & Aroma' },
                      { name: 'Pepper', icon: '🌶️', detail: 'Vital Warmth' },
                      { name: 'Methi', icon: '🌱', detail: 'Gut Balance' },
                      { name: 'Clove', icon: '🍀', detail: 'Preservation' },
                      { name: 'Beetel Leaf', icon: '🍃', detail: 'Natural Clarifier' },
                      { name: 'Turmeric', icon: '💛', detail: 'Golden Healing' }
                    ].map((ing, idx) => (
                      <div key={idx} className="bg-white/[0.03] border border-white/10 p-2 rounded-xl flex items-center gap-2 hover:bg-white/[0.08] hover:border-gold/30 transition-all duration-300">
                        <span className="text-lg">{ing.icon}</span>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[9px] font-black text-gold uppercase tracking-widest truncate">{ing.name}</span>
                          <span className="text-[7px] text-foreground/50 font-serif italic truncate">{ing.detail}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
                           {/* Size & Quantity Selector */}
            {product.quantity_options?.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-[9px] font-black text-foreground/40 uppercase tracking-[0.3em]">Select Volume & Quantity</h3>
                <div className="flex flex-col gap-3">
                  {product.quantity_options.map((opt: any) => {
                    const optFinal = Math.round(opt.baseCost * (1 - (opt.discountPercentage || 0) / 100));
                    const currentQty = quantities[opt.size] || 0;
                    return (
                      <div
                        key={opt.size}
                        className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 ${
                          currentQty > 0
                            ? 'border-gold bg-gold/5 shadow-sm'
                            : 'border-white/10 bg-white/[0.02] hover:border-gold/30'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-white uppercase tracking-wider">{opt.size}</span>
                            {opt.discountPercentage > 0 && (
                              <span className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full">
                                -{opt.discountPercentage}%
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-foreground/60 font-medium">
                            ₹{optFinal} {opt.discountPercentage > 0 && <span className="line-through text-[10px] ml-1">₹{opt.baseCost}</span>}
                          </div>
                        </div>

                        {/* Quantity Counter for this option */}
                        <div className="flex items-center gap-3 bg-[#23212e]/80 border border-white/10 rounded-xl p-1 shadow-sm">
                          <button
                            onClick={() => {
                              setQuantities(prev => ({
                                ...prev,
                                [opt.size]: Math.max(0, (prev[opt.size] || 0) - 1)
                              }));
                            }}
                            className="w-8 h-8 rounded-lg bg-white/10 text-white border border-white/10 flex items-center justify-center font-bold hover:bg-gold hover:text-[#23212e] active:scale-95 transition-all disabled:opacity-40"
                            disabled={currentQty === 0}
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm font-black text-white select-none font-mono">
                            {currentQty}
                          </span>
                          <button
                            onClick={() => {
                              setQuantities(prev => ({
                                ...prev,
                                [opt.size]: (prev[opt.size] || 0) + 1
                              }));
                            }}
                            className="w-8 h-8 rounded-lg bg-white/10 text-white border border-white/10 flex items-center justify-center font-bold hover:bg-gold hover:text-[#23212e] active:scale-95 transition-all"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="flex items-end gap-3 py-5 border-y border-white/10">
              <div className="flex flex-col gap-0.5">
                {totalPackages > 1 && (
                  <span className="text-[8px] font-black text-foreground/40 uppercase tracking-widest">
                    {totalPackages} items selected
                  </span>
                )}
                <span className="text-4xl font-serif font-bold text-gold">₹{totalPrice}</span>
              </div>
              {totalSavings > 0 && (
                <div className="space-y-0.5">
                  <div className="text-xs text-foreground/40 line-through font-medium">₹{totalBaseCost}</div>
                  <div className="text-[8px] font-black text-red-500 uppercase tracking-widest">You save ₹{totalSavings}</div>
                </div>
              )}
              <span className="ml-auto text-[8px] font-black text-foreground/40 uppercase tracking-widest">Free Delivery</span>
            </div>

          </div>

          {/* CTA Actions */}
          <div className="space-y-3 pt-6 border-t border-white/10">
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleAddToCart()}
                disabled={totalPackages === 0}
                className="w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl transition-all duration-500 flex items-center justify-center gap-2.5 active:scale-[0.98] bg-gold text-[#23212e] hover:bg-[#fdce47] hover:shadow-gold/15 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
              <button
                onClick={() => handleWhatsAppOrder()}
                disabled={totalPackages === 0}
                className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl transition-all duration-500 flex items-center justify-center gap-2.5 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed ${addedToCart ? 'bg-green-600 text-white' : 'bg-[#25D366] text-white hover:bg-green-600 hover:shadow-green-500/20'}`}
              >
                {addedToCart ? '✓ Order Sent!' : 'Milgan Buy'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => product.amazon_url && window.open(product.amazon_url, '_blank')}
                className={`py-3 rounded-xl font-bold text-[9px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-1.5 ${product.amazon_url
                  ? 'bg-[#FF9900] text-white hover:bg-[#e68900] shadow-md shadow-orange-500/10'
                  : 'bg-white/[0.03] text-foreground/20 cursor-not-allowed'}`}
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg" className={`w-3.5 h-3.5 ${product.amazon_url ? 'brightness-0 invert' : 'opacity-20'}`} alt="Amazon" />
                {product.amazon_url ? 'Amazon' : 'Amazon (Soon)'}
              </button>
              <button
                onClick={() => product.blinkit_url && window.open(product.blinkit_url, '_blank')}
                className={`py-3 rounded-xl font-bold text-[9px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-1.5 ${product.blinkit_url
                  ? 'bg-[#2874F0] text-white hover:bg-blue-600 shadow-md shadow-blue-500/10'
                  : 'bg-white/[0.03] text-foreground/20 cursor-not-allowed'}`}
              >
                <span className={`font-black italic ${!product.blinkit_url && 'opacity-20'}`}>Flipkart</span>
                {!product.blinkit_url && '(Soon)'}
              </button>
            </div>
          </div>

        </div>

      </div>

      <UserAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setAuthAction(null);
        }}
        onAuthenticated={() => {
          const saved = localStorage.getItem('boutiqueUser');
          const currentUser = saved ? JSON.parse(saved) : null;
          if (authAction === 'whatsapp') {
            handleWhatsAppOrder();
          } else if (authAction === 'cart') {
            handleAddToCart(currentUser);
          }
          setAuthAction(null);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => { setIsCheckoutOpen(false); setBookingError(''); setBookingSuccess(false); }}
        onConfirm={handleConfirmOrder}
        cart={quantitiesList.filter((item: any) => item.qty > 0).map((item: any) => ({
          id: product.id,
          name: product.name,
          image: allImages[0] || '',
          size: item.opt.size,
          basePrice: item.optFinal,
          quantity: item.qty
        }))}
        cartTotal={totalPrice}
        defaultName={user?.name || ''}
        defaultPhone={user?.phone || ''}
        defaultEmail={user?.email || ''}
        defaultAddress={user?.address || ''}
        isBooking={isBooking}
        bookingError={bookingError}
        bookingSuccess={bookingSuccess}
      />
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalBody, document.body)
    : null;
}
