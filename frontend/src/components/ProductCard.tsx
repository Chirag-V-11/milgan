"use client";
import React, { useState, useEffect } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

  const allImages: string[] = Array.from(new Set<string>(
    (product.image_urls && product.image_urls.length > 0)
      ? product.image_urls.filter((url: string) => url && url.trim() !== '')
      : (product.image_url ? [product.image_url] : [])
  )).filter(url => url !== null);

  const displayImage: string = allImages[currentImageIndex] || "https://images.unsplash.com/photo-1633519074163-95c029a1b8c0?auto=format&fit=crop&q=80&w=1000";

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
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const finalPrice = selectedSize.baseCost - (selectedSize.baseCost * (selectedSize.discountPercentage || 0)) / 100;

  const handleWhatsAppOrder = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
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

  return (
    <div className="group bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-700 flex flex-col w-full relative cursor-pointer border border-white/10 hover:border-gold/20">
      <div className="relative aspect-[4/5] overflow-hidden bg-white/[0.02]">
        <img
          key={currentImageIndex}
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-[2000ms] group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1633519074163-95c029a1b8c0?auto=format&fit=crop&q=80&w=1000";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {selectedSize.discountPercentage > 0 && (
          <div className="absolute top-4 left-4 bg-gold text-[#23212e] text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full z-10 shadow-xl">
            {selectedSize.discountPercentage}% OFF
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 md:p-8 space-y-4">
        <div className="space-y-1">
          <h3 className="text-base font-serif font-bold text-foreground leading-tight group-hover:text-gold transition-colors truncate">
            {product.name}
          </h3>
          <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40">{selectedSize.size}</p>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-xl font-serif font-bold text-gold">₹{finalPrice.toFixed(0)}</span>
          {selectedSize.discountPercentage > 0 && (
            <span className="text-[11px] text-foreground/40 line-through font-medium">₹{selectedSize.baseCost}</span>
          )}
        </div>
      </div>


      {/* Quick Action Button */}
      <div className="px-6 pb-6 md:px-8 md:pb-8 mt-auto">
        <button
          onClick={handleWhatsAppOrder}
          className="w-full bg-gold text-[#23212e] py-4 md:py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-500 hover:bg-[#e1ddde] hover:shadow-[0_15px_30px_-5px_rgba(252,196,51,0.2)] hover:-translate-y-1 active:scale-[0.98]"
        >
          WhatsApp Order
        </button>
        {/* Acquire button to navigate to product details */}
        <Link href={`/product/${product.id}`} className="w-full mt-3 text-center bg-white/5 text-foreground border border-white/10 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-gold hover:text-[#23212e] hover:border-transparent transition-colors duration-300 block">
          Acquire
        </Link>
      </div>

      <UserAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticated={() => handleWhatsAppOrder()}
      />
    </div>
  );
}
