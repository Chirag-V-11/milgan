"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { useCart } from '@/context/CartContext';
import UserAuthModal from '@/components/UserAuthModal';

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
  const [quantity, setQuantity] = useState(1);
  const [authAction, setAuthAction] = useState<'whatsapp' | 'cart' | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://milgan-backend.onrender.com';
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

  const finalPrice = selectedSize
    ? Math.round(selectedSize.baseCost * (1 - (selectedSize.discountPercentage || 0) / 100))
    : 0;
  const totalPrice = finalPrice * quantity;

  const handleWhatsAppOrder = (currentUser = user) => {
    if (!currentUser) {
      setAuthAction('whatsapp');
      setIsAuthModalOpen(true);
      return;
    }

    const message = `NEW ORDER RECEIVED
Customer Details:
Name: ${currentUser.name}
Phone: ${currentUser.phone}
Location: ${currentUser.address}

Product Details:
Item: ${product.name}
Size: ${selectedSize?.size}
Quantity: ${quantity}
Total Price: ₹${Math.round(totalPrice)}`;

    const text = encodeURIComponent(message);
    window.open(`https://wa.me/918660013411?text=${text}`, '_blank');
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleAddToCart = (currentUser = user) => {
    if (!product) return;
    if (!currentUser) {
      setAuthAction('cart');
      setIsAuthModalOpen(true);
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      image: allImages[0] || '',
      size: selectedSize?.size || 'Standard',
      basePrice: finalPrice,
      originalPrice: selectedSize?.baseCost || finalPrice
    }, quantity);
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
                  Clarified using pure Cow Butter, infused with traditional elements during slow wood-fire cooking to enrich aroma, shelf-life, and wellness:
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

            {/* Price */}
            <div className="flex items-end gap-4 py-6 border-y border-[#124B70]/10">
              <div className="flex flex-col gap-1">
                {quantity > 1 && (
                  <span className="text-[10px] font-black text-[#124B70]/50 uppercase tracking-widest">
                    ₹{finalPrice} per item
                  </span>
                )}
                <span className="text-5xl font-serif font-bold text-[#124B70]">₹{totalPrice}</span>
              </div>
              {selectedSize?.discountPercentage > 0 && (
                <div className="mb-1 space-y-0.5">
                  <div className="text-sm text-[#124B70]/50 line-through font-medium">₹{selectedSize.baseCost * quantity}</div>
                  <div className="text-[9px] font-black text-red-500 uppercase tracking-widest">You save ₹{(selectedSize.baseCost - finalPrice) * quantity}</div>
                </div>
              )}
              <span className="ml-auto text-[9px] font-black text-[#124B70]/50 uppercase tracking-widest">Free Delivery</span>
            </div>

            {/* Size Selector */}
            {product.quantity_options?.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-[#124B70]/50 uppercase tracking-[0.3em]">Select Volume</h3>
                <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
                  {product.quantity_options.map((opt: any) => {
                    const optFinal = Math.round(opt.baseCost * (1 - (opt.discountPercentage || 0) / 100));
                    const isSelected = selectedSize?.size === opt.size;
                    return (
                      <button
                        key={opt.size}
                        onClick={() => setSelectedSize(opt)}
                        className={`relative px-6 py-4 rounded-2xl border-2 transition-all duration-300 text-left group ${isSelected
                          ? 'border-[#124B70] bg-[#124B70] text-[#FDFDFD] shadow-md shadow-[#124B70]/10'
                          : 'border-[#124B70]/15 text-[#124B70] hover:border-[#124B70]/40 bg-white/40'}`}
                      >
                        <div className={`text-xs font-black uppercase tracking-widest ${isSelected ? 'text-[#FDFDFD]' : 'text-[#124B70]'}`}>{opt.size}</div>
                        <div className={`text-xs font-medium mt-0.5 ${isSelected ? 'text-[#FDFDFD]/80' : 'text-[#124B70]/60'}`}>₹{optFinal}</div>
                        {opt.discountPercentage > 0 && (
                          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full">
                            -{opt.discountPercentage}%
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-[#124B70]/50 uppercase tracking-[0.3em]">Select Quantity</h3>
              <div className="flex items-center gap-4 bg-white/40 border border-[#124B70]/15 w-fit rounded-2xl p-1.5 shadow-sm">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-10 h-10 rounded-xl bg-white border border-[#124B70]/10 text-[#124B70] flex items-center justify-center font-bold text-lg hover:bg-[#124B70] hover:text-[#FDFDFD] active:scale-95 transition-all shadow-sm disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#124B70] disabled:cursor-not-allowed"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="w-12 text-center text-base font-black text-[#124B70] select-none font-mono">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="w-10 h-10 rounded-xl bg-white border border-[#124B70]/10 text-[#124B70] flex items-center justify-center font-bold text-lg hover:bg-[#124B70] hover:text-[#FDFDFD] active:scale-95 transition-all shadow-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAddToCart()}
                  className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] bg-[#124B70] text-[#FDFDFD] hover:bg-[#124B70]/90 shadow-lg shadow-[#124B70]/10 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleWhatsAppOrder()}
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group active:scale-[0.98] ${addedToCart ? 'bg-green-600 text-white' : 'bg-[#25D366] text-white hover:bg-green-600 hover:shadow-green-500/10 hover:-translate-y-0.5'}`}
                >
                  {addedToCart ? '✓ Sent' : 'WhatsApp Buy'}
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
            handleWhatsAppOrder(currentUser);
          } else if (authAction === 'cart') {
            handleAddToCart(currentUser);
          }
          setAuthAction(null);
        }}
      />
    </div>
  );
}
