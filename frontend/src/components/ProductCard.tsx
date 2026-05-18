"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import UserAuthModal from './UserAuthModal';

export default function ProductCard({ product }: { product: any }) {
  const [selectedSize, setSelectedSize] = useState(product.quantity_options?.[0] || {});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (product.quantity_options && product.quantity_options.length > 0) {
      setSelectedSize(product.quantity_options[0]);
    }
  }, [product]);
  
  const allImages = Array.from(new Set(
    (product.image_urls && product.image_urls.length > 0)
      ? product.image_urls.filter((url: string) => url && url.trim() !== '')
      : (product.image_url ? [product.image_url] : [])
  )).filter(url => url !== null);

  const displayImage = allImages[currentImageIndex] || "https://images.unsplash.com/photo-1633519074163-95c029a1b8c0?auto=format&fit=crop&q=80&w=1000";

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (allImages.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
      }, 4000); // Slower, more relaxed transition
    }
    return () => clearInterval(interval);
  }, [allImages.length]);

  const { user } = useUser();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleWhatsAppOrder = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/whatsapp/generate-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: product.name,
          quantity: selectedSize.size,
          userName: user.name,
          address: user.address,
        }),
      });
      
      const data = await response.json();
      if (data.link) {
        window.open(data.link, '_blank');
      }
    } catch (error) {
      console.error("Failed to generate whatsapp link", error);
    }
  };

  const finalPrice = selectedSize.baseCost - (selectedSize.baseCost * (selectedSize.discountPercentage / 100));

  return (
    <div className="group bg-white rounded-[2.5rem] overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-700 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] flex flex-col w-full relative cursor-pointer border border-transparent hover:border-gold/20">
      <Link href={`/product/${product.id}`} className="block">
        {/* Product Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F8F7F5]">
          <img 
            key={currentImageIndex}
            src={displayImage} 
            alt={product.name} 
            className="w-full h-full object-cover transition-all duration-[2000ms] group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1633519074163-95c029a1b8c0?auto=format&fit=crop&q=80&w=1000";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {selectedSize.discountPercentage > 0 && (
            <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full z-10 shadow-xl">
              {selectedSize.discountPercentage}% OFF
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8 space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-serif font-bold text-forest leading-tight group-hover:text-gold transition-colors truncate">
              {product.name}
            </h3>
            <p className="text-[9px] font-black uppercase tracking-widest text-forest/20">{selectedSize.size}</p>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-serif font-bold text-gold">₹{finalPrice.toFixed(0)}</span>
            {selectedSize.discountPercentage > 0 && (
              <span className="text-[11px] text-forest/20 line-through font-medium">₹{selectedSize.baseCost}</span>
            )}
          </div>
        </div>
      </Link>

      {/* Quick Action Button */}
      <div className="px-6 pb-6 md:px-8 md:pb-8 mt-auto">
        <button 
          onClick={handleWhatsAppOrder}
          className="w-full bg-forest text-white py-4 md:py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-500 hover:bg-gold hover:shadow-[0_15px_30px_-5px_rgba(212,175,55,0.4)] hover:-translate-y-1 active:scale-[0.98]"
        >
          Quick Order
        </button>
      </div>

      <UserAuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onAuthenticated={() => handleWhatsAppOrder({ preventDefault: () => {}, stopPropagation: () => {} } as any)}
      />
    </div>
  );
}
