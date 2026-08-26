"use client";
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

interface PromoPopupCardProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  onBuyNow: () => void;
}

export default function PromoPopupCard({ product, isOpen, onClose, onBuyNow }: PromoPopupCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen || !product || !mounted) return null;

  const imageUrl = product?.image_url || product?.image || "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1000";

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-300">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Popup Card */}
      <div className="relative w-full max-w-[24rem] sm:max-w-[26rem] aspect-[4/5] rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden bg-gradient-to-b from-[#8C5D38] via-[#2F4D63] to-[#0E354F] border-4 border-[#fdce47]/80 shadow-[0_30px_90px_rgba(0,0,0,0.8)] z-10 flex flex-col justify-between p-6 sm:p-8 animate-in zoom-in-95 duration-400">
        
        {/* Top Left Badge */}
        <div className="absolute top-5 left-5 z-20">
          <span className="px-4 py-1.5 bg-[#0e3b59]/90 text-[#fdce47] border border-[#fdce47]/40 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-md backdrop-blur-md">
            LIMITED STOCK
          </span>
        </div>

        {/* Top Right Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white/90 hover:text-white flex items-center justify-center backdrop-blur-md transition-all text-xs font-bold shadow-md"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Background Image / Product Center Render */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={imageUrl}
            alt={product?.name || "Milgan Ghee"}
            fill
            priority
            className="object-cover object-center scale-105 opacity-90"
          />
          {/* Dark Gradient Overlay for Crisp Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d3652] via-[#0d3652]/40 to-transparent" />
        </div>

        {/* Content Section (Bottom Overlay) */}
        <div className="relative z-10 mt-auto space-y-3 pt-24 text-left">
          
          {/* Titles & Kannada Brand Heading */}
          <div className="space-y-1">
            <h2 className="text-4xl sm:text-5xl font-serif font-extrabold text-white tracking-tight drop-shadow-md leading-none">
              Ghee
            </h2>
            <div className="text-[#a4e287] font-bold text-lg sm:text-xl tracking-wide drop-shadow-sm flex items-center gap-2">
              <span>ಹಳ್ಳಿ ತುಪ್ಪ</span>
              <span className="text-xs uppercase tracking-widest text-[#fdce47] font-black">COW GHEE</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-white/90 text-xs sm:text-sm font-serif italic line-clamp-2 leading-relaxed drop-shadow-sm">
            Liquid Gold. Cultured by Tradition, Clarified by Fire. More than just ghee,...
          </p>

          {/* Thin Divider Line */}
          <div className="w-full h-px bg-white/30 my-3" />

          {/* CTA Button */}
          <div className="pt-1">
            <button
              onClick={() => {
                onClose();
                onBuyNow();
              }}
              className="px-7 py-3 bg-[#fdce47] hover:bg-[#ffdb65] active:scale-95 text-[#124B70] font-black text-xs sm:text-sm uppercase tracking-widest rounded-full shadow-[0_6px_25px_rgba(253,206,71,0.6)] transition-all duration-300 flex items-center justify-center gap-2 border border-[#fdce47]"
            >
              <span>BUY NOW</span>
              <span className="text-sm">➔</span>
            </button>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
}
