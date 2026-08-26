"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '@/config/api';

interface PromoPopupCardProps {
  productId?: string | number;
  delayMs?: number;
}

export default function PromoPopupCard({ productId = '615df5ef-148f-4557-a748-68e4d8fcdbad', delayMs = 300 }: PromoPopupCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const apiBase = getApiUrl();
        // Try fetching single product first, fallback to all products list
        let res = await fetch(`${apiBase}/api/products/${productId}`);
        if (res.ok) {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await res.json();
            if (data && data.name) {
              setProduct(data);
              setLoading(false);
              return;
            }
          }
        }

        // Fallback: fetch products list and take the first one or matching id
        res = await fetch(`${apiBase}/api/products`);
        if (res.ok) {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const list = await res.json();
            if (Array.isArray(list) && list.length > 0) {
              const matched = list.find((p: any) => String(p.id) === String(productId)) || list[0];
              setProduct(matched);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch promo popup product:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    // Show popup poster shortly after page mount/load
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, delayMs);

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [delayMs]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleBuyNow = () => {
    setIsOpen(false);
    const targetId = product?.id || productId;
    router.push(`/product/${targetId}`);
  };

  if (!isOpen) return null;

  // Derive dynamic pricing details from product if available
  const firstOption = product?.quantity_options && product.quantity_options.length > 0 ? product.quantity_options[0] : null;
  const baseCost = product?.price || (firstOption ? (firstOption.baseCost || firstOption.price) : 0);
  const discount = firstOption ? (firstOption.discountPercentage || 0) : 0;
  const finalPrice = discount > 0 ? Math.round(baseCost * (1 - discount / 100)) : baseCost;

  const imageUrl = product?.image_url || product?.image || "/image/place_the_ghee_jar_2K_202605141500.webp";
  const productName = product?.name || "Milgan Pure Cow Ghee";
  const productDescription = product?.description || "Liquid Gold. Cultured by Tradition, Clarified by Fire. More than just ghee,...";
  const productCategory = product?.category || "Limited Stock";

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-500 font-sans">
      {/* Backdrop overlay click handler */}
      <div
        className="fixed inset-0 cursor-pointer"
        onClick={handleClose}
        aria-label="Close modal background"
      />

      {/* Main Poster Popup Card with Yellow Frame & Home Page Card Aesthetics */}
      <div className="relative w-full max-w-[340px] sm:max-w-[400px] md:max-w-[440px] rounded-[2.5rem] sm:rounded-[3rem] border-[2px] sm:border-[3px] border-[#fdce47] bg-[#0d344d] shadow-[0_25px_60px_rgba(0,0,0,0.7),0_0_60px_rgba(253,206,71,0.3)] overflow-hidden transition-all duration-700 animate-in zoom-in-95 duration-500 z-10 flex flex-col group">

        {/* Close Button (X) */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#124B70]/80 hover:bg-[#124B70] text-[#fdce47] border border-[#fdce47]/40 flex items-center justify-center text-lg sm:text-xl font-bold transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg cursor-pointer"
          title="Close Popup"
        >
          ✕
        </button>

        {/* Dynamic Category / Stock Badge (Top Left) */}
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3.5 py-1.5 sm:px-5 sm:py-2 bg-[#124B70] backdrop-blur-md border border-[#fdce47]/50 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-[#fdce47] shadow-md flex items-center gap-1.5 whitespace-nowrap">
            {productCategory}
          </span>
        </div>

        {/* Poster Main Hero Section with Product Cover Image */}
        <div className="relative w-full aspect-[4/5] sm:aspect-[4/5] flex flex-col justify-between overflow-hidden p-6 sm:p-8">

          {/* Dynamic Background Image & Home-Page Gradient Overlays */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <Image
              src={imageUrl}
              alt={productName}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 440px"
              className="object-cover object-center transition-transform duration-[2000ms] group-hover:scale-110"
            />
            {/* Dark gradient overlay matching Home page card styling */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#124B70]/95 via-[#124B70]/40 to-transparent opacity-100 transition-opacity duration-700" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#124B70]/50 via-transparent to-transparent" />
          </div>

          {/* Top spacer */}
          <div className="relative z-10 pt-8" />

          {/* Content overlay matching home page card functionality */}
          <div className="relative z-10 space-y-3 sm:space-y-4 pt-16 sm:pt-20">

            {/* Title Section & Kannada Subtitle */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2 flex-wrap">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight drop-shadow-md">
                  {productName}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold text-[#fdce47] drop-shadow-sm font-serif">
                  ಹಳ್ಳಿ ತುಪ್ಪ
                </span>
                {/* {finalPrice > 0 && (
                  <span className="bg-[#fdce47] text-[#124B70] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    ₹{finalPrice}
                  </span>
                )} */}
              </div>
            </div>

            {/* Product Description */}
            <p className="text-white/90 font-serif italic text-xs sm:text-sm leading-snug drop-shadow line-clamp-2">
              {productDescription}
            </p>

            {/* Horizontal Line Divider */}
            <div className="pt-1">
              <div className="h-[1px] w-full bg-white/20" />
            </div>

            {/* CTA Buy Now Button */}
            <div className="pt-1 sm:pt-2">
              <button
                onClick={handleBuyNow}
                className="w-full sm:w-auto px-6 py-3 sm:py-3.5 bg-[#fdce47] hover:bg-[#ffe37d] text-[#124B70] rounded-full text-xs sm:text-sm font-black uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_8px_25px_rgba(253,206,71,0.5)] flex items-center justify-center gap-2 group/btn cursor-pointer animate-glow"
              >
                <span>Buy Now</span>
                <span className="text-base group-hover/btn:translate-x-1 transition-transform">➔</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
