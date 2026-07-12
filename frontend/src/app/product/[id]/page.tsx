"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { useCart } from '@/context/CartContext';
import UserAuthModal from '@/components/UserAuthModal';
import CheckoutModal, { CheckoutData } from '@/components/CheckoutModal';
import { getApiUrl } from '@/config/api';

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [authAction, setAuthAction] = useState<'whatsapp' | 'cart' | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const apiBase = getApiUrl();
        const res = await fetch(`${apiBase}/api/products/${id}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("Expected JSON response from server but received HTML or another format.");
        }
        const data = await res.json();
        setProduct(data);
        if (data && data.quantity_options?.length > 0) {
          setSelectedSize(data.quantity_options[0]);
          const initialQtys: Record<string, number> = {};
          data.quantity_options.forEach((opt: any) => {
            initialQtys[opt.size] = 0;
          });
          setQuantities(initialQtys);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div className="space-y-4 text-center">
        <div className="text-5xl animate-pulse">🏺</div>
        <p className="text-foreground/40 text-xs font-black uppercase tracking-[0.4em]">Summoning the masterpiece...</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-transparent">
      <div className="text-6xl">🔍</div>
      <p className="text-foreground font-serif italic text-2xl">This treasure has moved on.</p>
      <Link href="/" className="px-8 py-4 bg-gold text-[#23212e] rounded-full text-xs font-black uppercase tracking-widest">Return to Boutique</Link>
    </div>
  );

  const allImages: string[] = Array.from(new Set<string>([
    ...(product.image_urls?.filter((u: string) => u?.trim()) || []),
    ...(product.image_url ? [product.image_url] : [])
  ])).filter(Boolean);

  if (allImages.length === 0) allImages.push("https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1000");

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
      paymentMethod: 'WhatsApp',
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
        const message = `*NEW ORDER RECEIVED - MILGEN FOODS* 🌾🏺\n\n*Customer Details:*\n👤 Name: ${checkoutData.name}\n📞 Phone: ${checkoutData.phone}\n📍 Address: ${checkoutData.address}, ${checkoutData.city} - ${checkoutData.pincode}, ${checkoutData.state}\n📧 Email: ${checkoutData.email || 'N/A'}\n\n*Order Curation:*\n${orderItemText}\n\n--------------------------------\n💰 *Subtotal:* ₹${totalPrice}\n🚚 *Shipping:* FREE\n💵 *Total Payable:* ₹${totalPrice}\n\nThank you for choosing Milgen Foods!`;

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

  return (
    <div className="min-h-screen bg-transparent font-sans selection:bg-[#124B70]/10 relative overflow-hidden">
      {/* Radiant Background Atmospheric Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#124B70]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#124B70]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-12 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* ── LEFT: Image Gallery ── */}
          <div className="space-y-4 lg:sticky lg:top-28">
            {/* Main Image */}
            <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-white/80 shadow-[0_20px_50px_rgba(18,75,112,0.06)] border border-[#124B70]/10 group">
              <img
                key={activeImage}
                src={allImages[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-[1500ms] group-hover:scale-105"
                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1000"; }}
              />
              {/* Discount badge */}
              {selectedSize?.discountPercentage > 0 && (
                <div className="absolute top-6 left-6 bg-[#124B70] text-[#FDFDFD] text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-md">
                  {selectedSize.discountPercentage}% OFF
                </div>
              )}
              {/* Image counter */}
              {allImages.length > 1 && (
                <div className="absolute bottom-6 right-6 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-[9px] font-black text-[#124B70] uppercase tracking-widest shadow-sm">
                  {activeImage + 1} / {allImages.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {allImages.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${activeImage === idx ? 'border-[#124B70] scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-95'}`}
                  >
                    <img src={url} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Product Info ── */}
          <div className="space-y-10">

            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-black text-[#124B70]/70 uppercase tracking-[0.5em]">Artisanal Collection</span>
                <div className="h-px flex-1 bg-[#124B70]/10" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#124B70] tracking-tighter leading-[1.05]">
                {product.name}
              </h1>
              <p className="text-[#124B70]/80 font-serif italic text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Ingredients & Infusion Section */}
            {(product.name.toLowerCase().includes('ghee') || 
              product.name.toLowerCase().includes('butter') || 
              product.name.toLowerCase().includes('makhan') ||
              product.name.toLowerCase().includes('evning') || // fallback for user test products
              product.description.toLowerCase().includes('ghee') ||
              product.description.toLowerCase().includes('butter')) && (
              <div className="space-y-4 pt-6 border-t border-[#124B70]/10">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-[#124B70]/70 uppercase tracking-[0.3em]">The Alchemy of Infusion</span>
                  <div className="h-px flex-1 bg-[#124B70]/10" />
                </div>
                <p className="text-[#124B70]/80 text-xs leading-relaxed font-serif italic">
                  Clarified using pure Cow Butter, infused with traditional elements during slow cooking to enrich aroma, shelf-life, and wellness:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { name: 'Elachi', icon: '🏺', detail: 'Digestion & Aroma' },
                    { name: 'Pepper', icon: '🌶️', detail: 'Vital Warmth' },
                    { name: 'Methi', icon: '🌱', detail: 'Gut Balance' },
                    { name: 'Clove', icon: '🍀', detail: 'Preservation' },
                    { name: 'Beetel Leaf', icon: '🍃', detail: 'Natural Clarifier' },
                    { name: 'Turmeric', icon: '💛', detail: 'Golden Healing' }
                  ].map((ing, idx) => (
                    <div key={idx} className="bg-white/50 border border-[#124B70]/10 p-3 rounded-2xl flex items-center gap-2.5 hover:bg-white/80 hover:border-[#124B70]/30 transition-all duration-300">
                      <span className="text-xl">{ing.icon}</span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-black text-[#124B70] uppercase tracking-widest truncate">{ing.name}</span>
                        <span className="text-[8px] text-[#124B70]/60 font-serif italic truncate">{ing.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Size & Quantity Selector */}
            {product.quantity_options?.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-[#124B70]/50 uppercase tracking-[0.3em]">Select Volume & Quantity</h3>
                <div className="flex flex-col gap-3">
                  {product.quantity_options.map((opt: any) => {
                    const optFinal = Math.round(opt.baseCost * (1 - (opt.discountPercentage || 0) / 100));
                    const currentQty = quantities[opt.size] || 0;
                    return (
                      <div
                        key={opt.size}
                        className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 ${
                          currentQty > 0
                            ? 'border-[#124B70] bg-[#124B70]/5 shadow-sm'
                            : 'border-[#124B70]/15 bg-white/40 hover:border-[#124B70]/40'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-[#124B70] uppercase tracking-wider">{opt.size}</span>
                            {opt.discountPercentage > 0 && (
                              <span className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full">
                                -{opt.discountPercentage}%
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#124B70]/60 font-medium">
                            ₹{optFinal} {opt.discountPercentage > 0 && <span className="line-through text-[10px] ml-1">₹{opt.baseCost}</span>}
                          </div>
                        </div>

                        {/* Quantity Counter for this option */}
                        <div className="flex items-center gap-3 bg-white/85 border border-[#124B70]/15 rounded-xl p-1 shadow-sm">
                          <button
                            onClick={() => {
                              setQuantities(prev => ({
                                ...prev,
                                [opt.size]: Math.max(0, (prev[opt.size] || 0) - 1)
                              }));
                            }}
                            className="w-8 h-8 rounded-lg bg-white border border-[#124B70]/10 text-[#124B70] flex items-center justify-center font-bold hover:bg-[#124B70] hover:text-[#FDFDFD] active:scale-95 transition-all disabled:opacity-40"
                            disabled={currentQty === 0}
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm font-black text-[#124B70] select-none font-mono">
                            {currentQty}
                          </span>
                          <button
                            onClick={() => {
                              setQuantities(prev => ({
                                ...prev,
                                [opt.size]: (prev[opt.size] || 0) + 1
                              }));
                            }}
                            className="w-8 h-8 rounded-lg bg-white border border-[#124B70]/10 text-[#124B70] flex items-center justify-center font-bold hover:bg-[#124B70] hover:text-[#FDFDFD] active:scale-95 transition-all"
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
            <div className="flex items-end gap-4 py-6 border-y border-[#124B70]/10">
              <div className="flex flex-col gap-1">
                {totalPackages > 1 && (
                  <span className="text-[10px] font-black text-[#124B70]/50 uppercase tracking-widest">
                    {totalPackages} items selected
                  </span>
                )}
                <span className="text-5xl font-serif font-bold text-[#124B70]">₹{totalPrice}</span>
              </div>
              {totalSavings > 0 && (
                <div className="mb-1 space-y-0.5">
                  <div className="text-sm text-[#124B70]/50 line-through font-medium">₹{totalBaseCost}</div>
                  <div className="text-[9px] font-black text-red-500 uppercase tracking-widest">You save ₹{totalSavings}</div>
                </div>
              )}
              <span className="ml-auto text-[9px] font-black text-[#124B70]/50 uppercase tracking-widest">Free Delivery</span>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAddToCart()}
                  disabled={totalPackages === 0}
                  className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] bg-[#124B70] text-[#FDFDFD] hover:bg-[#124B70]/90 shadow-lg shadow-[#124B70]/10 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleWhatsAppOrder()}
                  disabled={totalPackages === 0}
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${addedToCart ? 'bg-green-600 text-white' : 'bg-[#25D366] text-white hover:bg-green-600 hover:shadow-green-500/10 hover:-translate-y-0.5'}`}
                >
                  {addedToCart ? '✓ Sent' : 'Milgan Buy'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => product.amazon_url && window.open(product.amazon_url, '_blank')}
                  className={`py-4 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${product.amazon_url
                    ? 'bg-[#FF9900] text-white hover:bg-[#e68900] shadow-lg shadow-orange-500/15 hover:-translate-y-0.5'
                    : 'bg-[#124B70]/5 border border-[#124B70]/10 text-[#124B70]/30 cursor-not-allowed'}`}
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg" className={`w-4 h-4 ${product.amazon_url ? 'brightness-0 invert' : 'opacity-20'}`} alt="Amazon" />
                  {product.amazon_url ? 'Buy on Amazon' : 'Amazon (Soon)'}
                </button>
                <button
                  onClick={() => product.blinkit_url && window.open(product.blinkit_url, '_blank')}
                  className={`py-4 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${product.blinkit_url
                    ? 'bg-[#2874F0] text-white hover:bg-blue-600 shadow-lg shadow-blue-500/15 hover:-translate-y-0.5'
                    : 'bg-[#124B70]/5 border border-[#124B70]/10 text-[#124B70]/30 cursor-not-allowed'}`}
                >
                  <span className={`font-black italic ${!product.blinkit_url && 'opacity-30'}`}>Flipkart</span>
                  {!product.blinkit_url && '(Soon)'}
                </button>
              </div>
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
}
