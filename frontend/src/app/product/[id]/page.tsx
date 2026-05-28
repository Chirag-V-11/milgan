"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import UserAuthModal from '@/components/UserAuthModal';

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [product, setProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://milgan-backend.onrender.com';
        const res = await fetch(`${apiBase}/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
        if (data.quantity_options?.length > 0) {
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
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
      <div className="space-y-4 text-center">
        <div className="text-5xl animate-pulse">🏺</div>
        <p className="text-forest/40 text-xs font-black uppercase tracking-[0.4em]">Summoning the masterpiece...</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#FDFCFB]">
      <div className="text-6xl">🔍</div>
      <p className="text-forest font-serif italic text-2xl">This treasure has moved on.</p>
      <Link href="/" className="px-8 py-4 bg-forest text-white rounded-full text-xs font-black uppercase tracking-widest">Return to Boutique</Link>
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

  const handleWhatsAppOrder = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    const message = `NEW ORDER RECEIVED
Customer Details:
Name: ${user.name}
Phone: ${user.phone}
Location: ${user.address}

Product Details:
Item: ${product.name}
Size: ${selectedSize?.size}
Total Price: ₹${Math.round(finalPrice)}`;

    const text = encodeURIComponent(message);
    window.open(`https://wa.me/918660013411?text=${text}`, '_blank');
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const benefits = [
    { icon: '🏺', title: 'Ancient Bilona', desc: 'Traditional hand-churning at dawn preserves all nutrients' },
    { icon: '🐄', title: 'A2 Gir Cow', desc: 'Purebred indigenous cows, grass-fed in open sanctuaries' },
    { icon: '🌿', title: '100% Pure', desc: 'No additives, preservatives or artificial colouring' },
    { icon: '✨', title: 'Small Batch', desc: 'Limited production ensures consistent artisanal quality' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FCFAF7] via-[#FDFBF7] to-[#FCE38A]/20 font-sans selection:bg-forest/20 relative overflow-hidden">
      {/* Radiant Background Atmospheric Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cream/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-forest/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      {/* Top Nav Bar */}
      {/* <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-forest/5 px-6 md:px-12 py-4 flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-forest/40 hover:text-forest transition-colors">
          <span>←</span> Back
        </button>
        <Link href="/" className="text-xl font-serif font-bold text-forest tracking-tighter">Milgan.</Link>
        <div className="w-16" />
      </nav> */}

      <div className="max-w-7xl mx-auto px-4 md:px-12 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* ── LEFT: Image Gallery ── */}
          <div className="space-y-4 lg:sticky lg:top-28">
            {/* Main Image */}
            <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-cream/20 shadow-[0_30px_80px_rgba(27,67,50,0.12)] group">
              <img
                key={activeImage}
                src={allImages[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-[1500ms] group-hover:scale-105"
                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1000"; }}
              />
              {/* Discount badge */}
              {selectedSize?.discountPercentage > 0 && (
                <div className="absolute top-6 left-6 bg-forest text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-xl">
                  {selectedSize.discountPercentage}% OFF
                </div>
              )}
              {/* Image counter */}
              {allImages.length > 1 && (
                <div className="absolute bottom-6 right-6 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-[9px] font-black text-forest uppercase tracking-widest">
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
                    className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${activeImage === idx ? 'border-forest scale-105 shadow-lg' : 'border-transparent opacity-50 hover:opacity-80'}`}
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
                <span className="text-[9px] font-black text-gold uppercase tracking-[0.5em]">Artisanal Collection</span>
                <div className="h-px flex-1 bg-gold/20" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-forest tracking-tighter leading-[1.05]">
                {product.name}
              </h1>
              <p className="text-forest/60 font-serif italic text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-end gap-4 py-6 border-y border-forest/5">
              <span className="text-5xl font-serif font-bold text-forest">₹{finalPrice}</span>
              {selectedSize?.discountPercentage > 0 && (
                <div className="mb-1 space-y-0.5">
                  <div className="text-sm text-forest/30 line-through font-medium">₹{selectedSize.baseCost}</div>
                  <div className="text-[9px] font-black text-red-500 uppercase tracking-widest">You save ₹{selectedSize.baseCost - finalPrice}</div>
                </div>
              )}
              <span className="ml-auto text-[9px] font-black text-forest/30 uppercase tracking-widest">Free Delivery</span>
            </div>

            {/* Size Selector */}
            {product.quantity_options?.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-forest/40 uppercase tracking-[0.3em]">Select Volume</h3>
                <div className="flex flex-wrap gap-3">
                  {product.quantity_options.map((opt: any) => {
                    const optFinal = Math.round(opt.baseCost * (1 - (opt.discountPercentage || 0) / 100));
                    const isSelected = selectedSize?.size === opt.size;
                    return (
                      <button
                        key={opt.size}
                        onClick={() => setSelectedSize(opt)}
                        className={`relative px-6 py-4 rounded-2xl border-2 transition-all duration-300 text-left group ${isSelected
                          ? 'border-forest bg-forest text-white shadow-xl shadow-forest/20'
                          : 'border-forest/10 text-forest hover:border-forest/40 bg-white'}`}
                      >
                        <div className={`text-xs font-black uppercase tracking-widest ${isSelected ? 'text-white' : 'text-forest'}`}>{opt.size}</div>
                        <div className={`text-xs font-medium mt-0.5 ${isSelected ? 'text-white/70' : 'text-forest/40'}`}>₹{optFinal}</div>
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

            {/* CTA Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleWhatsAppOrder}
                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all duration-500 flex items-center justify-center gap-3 group active:scale-[0.98] ${addedToCart ? 'bg-green-600 text-white' : 'bg-[#25D366] text-white hover:bg-green-600 hover:shadow-green-500/30 hover:-translate-y-0.5'}`}
              >
                {addedToCart ? (
                  <>✓ Order Sent!</>
                ) : (
                  <>
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    Order via WhatsApp
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => product.amazon_url && window.open(product.amazon_url, '_blank')}
                  className={`py-4 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${product.amazon_url
                    ? 'bg-[#FF9900] text-white hover:bg-[#e68900] shadow-lg shadow-orange-500/15 hover:-translate-y-0.5'
                    : 'bg-forest/5 text-forest/20 cursor-not-allowed'}`}
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg" className={`w-4 h-4 ${product.amazon_url ? 'brightness-0 invert' : 'opacity-20'}`} alt="Amazon" />
                  {product.amazon_url ? 'Buy on Amazon' : 'Amazon (Soon)'}
                </button>
                <button
                  onClick={() => product.blinkit_url && window.open(product.blinkit_url, '_blank')}
                  className={`py-4 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${product.blinkit_url
                    ? 'bg-[#2874F0] text-white hover:bg-blue-600 shadow-lg shadow-blue-500/15 hover:-translate-y-0.5'
                    : 'bg-forest/5 text-forest/20 cursor-not-allowed'}`}
                >
                  <span className={`font-black italic ${!product.blinkit_url && 'opacity-20'}`}>Flipkart</span>
                  {!product.blinkit_url && '(Soon)'}
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 py-6 border-y border-forest/5">
              {[
                { icon: '🚚', label: 'Free Delivery' },
                { icon: '✅', label: 'Verified Pure' },
                { icon: '↩️', label: 'Easy Returns' },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center gap-2 text-center p-3 rounded-2xl bg-forest/[0.02] hover:bg-forest/5 transition-colors">
                  <span className="text-xl">{b.icon}</span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-forest/50">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BENEFITS SECTION ── */}
        <div className="mt-24 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-black text-gold uppercase tracking-[0.6em]">Why Milgan</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-forest tracking-tighter">The Sacred Difference.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <div key={i} className="p-8 bg-white rounded-[2rem] border border-forest/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 space-y-4 group">
                <div className="text-4xl group-hover:scale-110 transition-transform duration-500">{b.icon}</div>
                <h4 className="font-black text-[10px] uppercase tracking-widest text-forest">{b.title}</h4>
                <p className="text-forest/50 text-xs leading-relaxed font-serif italic">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── BACK TO COLLECTION ── */}
        <div className="mt-24 text-center">
          <Link
            href="/#boutique"
            className="inline-flex items-center gap-3 px-10 py-5 bg-forest text-white rounded-full font-black text-[10px] uppercase tracking-[0.4em] hover:bg-cream hover:text-forest hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
          >
            ← Explore Full Collection
          </Link>
        </div>
      </div>

      <UserAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticated={() => handleWhatsAppOrder()}
      />
    </div>
  );
}
