"use client";
import React, { useEffect, useState } from 'react';
import ProductCard from "@/components/ProductCard";
import Link from 'next/link';
import SixPillarsScroll from "@/components/SixPillarsScroll";


const galleryItems = [
  {
    id: 1,
    title: "The Sacred Churn",
    category: "Vedic Bilona",
    description: "Our milk is cultured overnight and hand-churned in two directions before dawn using traditional wooden churning rods (bilona) to preserve the rich, fragile fatty acids.",
    image: "/image/image.webp"
  },
  {
    id: 2,
    title: "Liquid Life Force",
    category: "Sacred Cooking",
    description: "Butter is slow-cooked over a gentle wood fire. As it clarifies, the golden liquid is infused with cardamoms, pepper, methi, cloves, betel leaf, and turmeric.",
    image: "/image/place_the_ghee_jar_2K_202605141500.webp"
  },
  {
    id: 3,
    title: "Nurtured by Nature",
    category: "Ethical Sourcing",
    description: "Sourced directly from indigenous farms where grass-fed Gir and Sahiwal cows graze freely under open skies, loved and respected as family.",
    image: "/image/nature.webp"
  }
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<any | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedGalleryItem(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCenterHovered, setIsCenterHovered] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);

    const fetchProducts = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://milgan-backend.onrender.com';
        const response = await fetch(`${apiBase}/api/products?t=${Date.now()}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("Expected JSON response from server but received HTML or another format.");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-transparent font-sans selection:bg-gold/30 overflow-x-clip scroll-smooth relative">

      {/* Glistening Atmosphere over Dark Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[60%] bg-white/5 rounded-full blur-[120px] animate-pulse duration-[10s]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[50%] bg-gold/5 rounded-full blur-[100px] animate-pulse duration-[8s] delay-1000" />
      </div>

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 h-1 bg-gold z-[100] transition-all duration-300" style={{ width: `${scrollProgress}%` }} />

      {/* 1. MINIMALIST TYPOGRAPHIC HERO */}
      <section className="relative h-[100vh] flex items-center justify-center overflow-hidden bg-transparent">
        <div className="absolute inset-0 z-0 bg-transparent" />

        <div className="relative z-10 text-center space-y-12 md:space-y-16 px-6 max-w-7xl translate-y-8 md:translate-y-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            {/* Left Column: Kannada Logo */}
            <div className="flex-shrink-0">
              <img
                src="/image/milgan logo-0.png"
                alt="Milgan Kannada Logo"
                className="w-full max-w-[16rem] sm:max-w-[20rem] object-contain select-none"
              />
            </div>

            {/* Right Column: Main Logo and Tagline stacked */}
            <div className="flex flex-col items-center gap-4">
              <img
                src="/image/milgan side logo-2.png"
                alt="MILGAN - Fresh | Pure | Delicious"
                className="w-full max-w-[28rem] sm:max-w-[32rem] object-contain select-none"
              />
              <img
                src="/image/Milgan tagline.png"
                alt="Milgan Tagline"
                className="w-full max-w-[28rem] sm:max-w-[32rem] object-contain select-none"
              />
            </div>
          </div>
          <button onClick={() => document.getElementById('boutique')?.scrollIntoView({ behavior: 'smooth' })} className="group relative px-12 md:px-16 py-5 md:py-7 bg-gold text-[#23212e] rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl font-black uppercase tracking-[0.5em] text-[9px] md:text-[10px]">
            <div className="absolute inset-0 bg-[#e1ddde] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative z-10 group-hover:text-[#23212e] transition-colors">Enter Sanctuary</span>
          </button>
        </div>
      </section>

      {/* 3. STAGGERED BOUTIQUE GALLERY */}
      <section id="boutique" className="pt-18 pb-24 md:pt-18 md:pb-18 relative border-y border-white/5 scroll-mt-24 overflow-hidden bg-transparent">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[20vw] font-serif font-black text-white/[0.02] select-none pointer-events-none whitespace-nowrap tracking-tighter">
          COLLECTION COLLECTION COLLECTION
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-24 md:space-y-10 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto">
            <span className="text-gold text-[10px] font-black uppercase tracking-[0.8em]">Artisanal Selection</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground tracking-tighter leading-tight italic">Liquid Gold,<span className="text-gold not-italic">Captured.</span></h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-12 pb-4">
              {[1, 2, 3].map(i => (
                <div key={i} className={`aspect-[4/5] rounded-[2.5rem] md:rounded-[3rem] bg-white/[0.05] animate-pulse ${i === 3 ? 'col-span-2 md:col-span-1' : ''}`} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-12 pb-4 max-w-6xl mx-auto">
              {products.map((product: any, i: number) => {
                // Calculate display price and discount from nested quantity options
                const firstOption = product.quantity_options && product.quantity_options.length > 0 ? product.quantity_options[0] : null;
                const baseCost = product.price || (firstOption ? (firstOption.baseCost || firstOption.price) : 0);
                const discount = firstOption ? (firstOption.discountPercentage || 0) : 0;
                const finalPrice = discount > 0 ? Math.round(baseCost * (1 - discount / 100)) : baseCost;

                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className={`
                      group transition-all duration-700 cursor-pointer flex flex-col justify-between w-full
                      ${i === 2 ? 'col-span-2 justify-self-center max-w-[calc(50%-0.5rem)] md:col-span-1 md:justify-self-auto md:max-w-none' : ''}
                    `}
                  >
                    <div
                      className="block relative aspect-[4/5] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden bg-white/[0.03] backdrop-blur-sm border border-white/10 shadow-sm group-hover:shadow-2xl transition-all duration-700 w-full"
                    >
                      <img
                        src={product.image_url || product.image || "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1000"}
                        className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                        alt={product.name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#23212e]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                      <div className="absolute top-3 left-3 md:top-8 md:left-8">
                        <span className="px-3 py-1 md:px-5 md:py-2 bg-black/40 backdrop-blur-md rounded-full text-[7px] md:text-[9px] font-black uppercase tracking-wider md:tracking-widest text-gold border border-white/10 whitespace-nowrap shadow-sm">
                          {product.category || 'Limited Stock'}
                        </span>
                      </div>

                      <div className="absolute bottom-10 left-10 right-10 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 space-y-6">
                        <div className="space-y-2">
                          <h3 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">{product.name}</h3>
                          <p className="text-white/60 text-sm italic line-clamp-2">{product.description}</p>
                        </div>
                        <div className="pt-4 border-t border-white/20">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/80 group-hover:text-white transition-colors">
                            Acquire Curation ➔
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 space-y-2">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-lg font-serif font-bold text-foreground group-hover:text-gold transition-colors">{product.name}</h3>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-foreground/70">Limited Batch</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-lg font-serif font-bold text-gold">₹{finalPrice}</span>
                        {discount > 0 && (
                          <span className="text-xs text-foreground/40 line-through">₹{baseCost}</span>
                        )}
                      </div>
                      <div className="h-px w-full bg-white/10" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Sanctuary Gallery */}
          <div className="pt-20 border-t border-white/5 space-y-16">
            <div className="flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto">
              <span className="text-gold text-[10px] font-black uppercase tracking-[0.8em]">Frames of Devotion</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground tracking-tighter leading-tight italic">Sanctuary <span className="text-gold not-italic">Gallery.</span></h2>
              <p className="text-foreground/60 text-sm font-serif italic max-w-md">Take a visual journey through our slow, sacred churning process and the pristine environments where we craft our liquid gold.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-12 pb-4 max-w-6xl mx-auto">
              {galleryItems.map((item, i) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedGalleryItem(item)}
                  className={`
                    group transition-all duration-700 cursor-pointer flex flex-col justify-between w-full
                    ${i === 2 ? 'col-span-2 justify-self-center max-w-[calc(50%-0.5rem)] md:col-span-1 md:justify-self-auto md:max-w-none' : ''}
                  `}
                >
                  <div className="block relative aspect-[4/5] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden bg-white/[0.03] backdrop-blur-sm border border-white/10 shadow-sm group-hover:shadow-2xl transition-all duration-700 w-full">
                    <img
                      src={item.image}
                      className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                      alt={item.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#23212e]/90 via-[#23212e]/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="absolute top-3 left-3 md:top-8 md:left-8">
                      <span className="px-3 py-1 md:px-5 md:py-2 bg-black/40 backdrop-blur-md rounded-full text-[7px] md:text-[9px] font-black uppercase tracking-wider md:tracking-widest text-gold border border-white/10 whitespace-nowrap shadow-sm">
                        {item.category}
                      </span>
                    </div>

                    <div className="absolute bottom-10 left-10 right-10 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">{item.title}</h3>
                        <p className="text-white/60 text-xs italic line-clamp-3">{item.description}</p>
                      </div>
                      <div className="pt-4 border-t border-white/20">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/80 group-hover:text-white transition-colors">
                          Reveal Wisdom ➔
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-lg font-serif font-bold text-foreground group-hover:text-gold transition-colors">{item.title}</h3>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-foreground/70">{item.category}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-foreground/60 font-serif italic line-clamp-1">{item.description}</span>
                    </div>
                    <div className="h-px w-full bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 ABOUT US (THE HERITAGE) */}
      <section className="py-18 md:py-18 relative z-10 bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-start">
            <div className="flex flex-col items-center gap-12 lg:gap-16">
              <div className="w-full relative aspect-square md:aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl group">
                <img
                  src="image/image.png"
                  className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-105"
                  alt="Vedic Churning Process"
                />
                <div className="absolute inset-0 bg-[#23212e]/25 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="absolute bottom-8 left-8 right-8 p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl">
                  <p className="text-white font-serif italic text-sm md:text-base leading-relaxed shadow-sm">
                    "Every jar is a testament to patience. We don't just make ghee; we preserve a 5,000-year-old ritual."
                  </p>
                </div>
              </div>

              {/* Holistic Purity section */}
              <div className="w-full flex flex-col items-center justify-center py-6 md:py-0">

                {/* Circular Layout Container */}
                <div
                  className="relative benefits-container w-[340px] h-[240px] md:w-[600px] md:h-[420px] lg:w-[460px] lg:h-[340px] xl:w-[600px] xl:h-[420px] transition-all duration-700"
                  onMouseEnter={() => setIsRevealed(true)}
                  onMouseLeave={() => {
                    setIsRevealed(false);
                    setIsCenterHovered(false);
                    setHoveredIdx(null);
                  }}
                  onClick={() => setIsRevealed(true)}
                >
                  {/* Center Circle Element */}
                  <div
                    className={`absolute z-20 w-28 h-28 md:w-48 md:h-48 lg:w-36 lg:h-36 xl:w-48 xl:h-48 rounded-full border border-gold/40 bg-[#23212e]/90 backdrop-blur-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-700 shadow-xl left-1/2 top-[80px] md:top-[130px] lg:top-[100px] xl:top-[130px] ${isCenterHovered
                      ? 'shadow-[0_0_40px_rgba(252,196,51,0.4)] border-gold'
                      : 'hover:border-gold/80 hover:shadow-[0_0_20px_rgba(252,196,51,0.2)]'
                      }`}
                    style={{
                      transform: `translate(-50%, -50%) ${isCenterHovered ? 'scale(1.1)' : 'scale(1)'}`,
                    }}
                    onMouseEnter={() => {
                      setIsCenterHovered(true);
                      setIsRevealed(true);
                    }}
                    onMouseLeave={() => setIsCenterHovered(false)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.innerWidth < 768) {
                        setIsRevealed(!isRevealed);
                        setHoveredIdx(null);
                      }
                    }}
                  >
                    <div className="text-center space-y-0.5 select-none px-2.5">
                      <span className="block text-[9px] md:text-sm font-black uppercase tracking-[0.2em] text-gold leading-tight">
                        <span className="hidden md:inline">
                          {hoveredIdx !== null
                            ? [
                              'Immunity',
                              'Bilona Churned',
                              'Easy Digestion',
                              'Rich Nutrition',
                              'Delicious Taste'
                            ][hoveredIdx]
                            : 'Benefits'}
                        </span>
                        <span className="inline md:hidden">
                          Benefits
                        </span>
                      </span>
                      <span className="block text-[7px] md:text-[9px] font-serif italic text-white/50 tracking-normal leading-none">
                        <span className="hidden md:inline">
                          {hoveredIdx !== null
                            ? 'Vedic Benefit'
                            : isRevealed
                              ? 'Revealed'
                              : 'Hover to view'}
                        </span>
                        <span className="inline md:hidden">
                          {isRevealed ? 'Revealed' : 'Tap to view'}
                        </span>
                      </span>
                    </div>

                    {/* Outer decorative ring */}
                    <div className="absolute inset-[-6px] rounded-full border border-gold/20 animate-spin-slow pointer-events-none" />
                  </div>

                  {/* Around this: the benefit items */}
                  {[
                    { title: 'Immunity', image: '/image/immunity.png' },
                    { title: 'Bilona Churned', image: '/image/bilona.png' },
                    { title: 'Easy Digestion', image: '/image/digestion.png' },
                    { title: 'Rich Nutrition', image: '/image/nutrition.png' },
                    { title: 'Delicious Taste', image: '/image/delicious.png' }
                  ].map((p, i) => {
                    const angle = 180 - i * 45; // Semicircle layout below the center (180 to 0 degrees)
                    return (
                      <div
                        key={i}
                        className={`absolute left-1/2 top-[80px] md:top-[130px] lg:top-[100px] xl:top-[130px] w-14 h-14 md:w-36 md:h-36 lg:w-28 lg:h-28 xl:w-36 xl:h-36 rounded-full z-10 flex flex-col items-center justify-center p-1 md:p-6 lg:p-4 xl:p-6 bg-[#23212e]/70 backdrop-blur-md border border-white/10 transition-all duration-700 group cursor-pointer hover:border-gold/50 hover:bg-[#23212e]/95 ${isRevealed
                          ? 'opacity-100 blur-none shadow-[0_0_25px_rgba(252,196,51,0.15)] border-gold/30'
                          : 'opacity-10 blur-[1px]'
                          }`}
                        onMouseEnter={() => setHoveredIdx(i)}
                        onMouseLeave={() => setHoveredIdx(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.innerWidth < 768) {
                            setHoveredIdx(hoveredIdx === i ? null : i);
                          }
                        }}
                        style={{
                          transform: `translate(-50%, -50%) rotate(${angle}deg) translate(${isRevealed ? 'var(--radius)' : '0px'
                            }) rotate(${-angle}deg) scale(${hoveredIdx === i ? 1.1 : isRevealed ? 1 : 0.5
                            })`,
                        }}
                      >
                        <div className="w-6 h-6 md:w-16 md:h-16 lg:w-10 lg:h-10 xl:w-16 xl:h-16 relative overflow-hidden group-hover:scale-110 transition-transform duration-700 flex items-center justify-center">
                          <img src={p.image} className="w-full h-full object-contain filter brightness-110 contrast-110" alt={p.title} />
                        </div>
                        <h3 className="hidden md:block text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/90 group-hover:text-gold transition-colors text-center mt-2 max-w-[100px] leading-tight">
                          {p.title}
                        </h3>
                        {/* Tooltip on desktop only */}
                        <div className="absolute bottom-[-28px] hidden md:group-hover:block bg-[#23212e]/95 text-gold text-[8px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-gold/30 pointer-events-none whitespace-nowrap shadow-md">
                          {p.title}
                        </div>
                        {/* Selected benefit label on mobile only, placed directly below the option circle */}
                        <div
                          className={`absolute top-full left-1/2 -translate-x-1/2 mt-1.5 md:hidden bg-[#23212e]/95 border border-gold/30 text-gold text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-lg pointer-events-none whitespace-nowrap transition-all duration-300 z-30 ${hoveredIdx === i && isRevealed ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-1 scale-95'}`}
                        >
                          {p.title}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="space-y-10 md:space-y-12">
              <div className="space-y-4">
                <span className="text-gold text-[10px] md:text-xs font-black uppercase tracking-[0.8em]">Our Legacy</span>
                <h2 className="text-5xl md:text-7xl font-serif font-bold text-foreground tracking-tighter leading-[1.1]">The Return to <br /><span className="italic font-light text-gold">Purity.</span></h2>
              </div>
              <div className="space-y-6 text-foreground/80 text-lg md:text-xl font-serif leading-relaxed">
                <p>
                  Milgan was born out of a longing for the truth. In a world of mass production and forgotten roots, we chose the harder, slower path.
                </p>
                <p>
                  We partner exclusively with indigenous farms where purebred cows graze freely in sunlit pastures. We follow the sacred Bilona method—curding the milk, churning it in two directions before dawn, and slow-cooking the makhan over a gentle wood fire.
                </p>
                <p>
                  During the slow clarification process, the ghee is infused with traditional elements—<strong>Elachi, pepper, methi, clove, beetel leaf, and turmeric</strong>—honoring ancient recipes to enhance its aroma, preservation, and healing power.
                </p>
                <p className="font-bold text-gold">
                  The result is not merely an ingredient, but liquid life force. This is our promise. This is Milgan.
                </p>
              </div>

              {/* Traditional Ingredients Grid */}
              <div className="pt-8 border-t border-white/10 space-y-4">
                <span className="text-gold text-[10px] font-black uppercase tracking-[0.4em]">The Alchemical Infusion</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { name: 'Elachi', image: '/image/elachi.png', detail: 'Digestion & Aroma' },
                    { name: 'Pepper', image: '/image/pepper.png', detail: 'Vital Warmth' },
                    { name: 'Methi', image: '/image/methi.png', detail: 'Gut Balance' },
                    { name: 'Clove', image: '/image/clove.png', detail: 'Preservation' },
                    { name: 'Beetel Leaf', image: '/image/beetel.png', detail: 'Natural Clarifier' },
                    { name: 'Turmeric', image: '/image/turmeric.png', detail: 'Golden Healing' }
                  ].map((ing, idx) => (
                    <div key={idx} className="bg-white/[0.03] backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col items-center text-center space-y-1.5 hover:bg-white/[0.08] hover:border-gold/30 transition-all duration-300">
                      <div className="w-12 h-12 relative overflow-hidden">
                        <img src={ing.image} className="w-full h-full object-contain" alt={ing.name} />
                      </div>
                      <span className="text-xs font-black text-foreground uppercase tracking-widest">{ing.name}</span>
                      <span className="text-[9px] text-foreground/60 font-serif italic">{ing.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4 flex items-center gap-8">
                <div className="text-gold text-4xl">🌿</div>
                <div className="h-px flex-1 bg-white/10" />
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Since Time Immemorial</div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* 3.5 THE ALCHEMY OF THE SIX PILLARS (SCROLLING EFFECT) */}
      <SixPillarsScroll />



      {/* 5. ARTISAN WALL OF TRUST */}
      <section className="py-18 relative overflow-hidden border-t border-white/5 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 space-y-18">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-serif font-bold text-foreground tracking-tighter">What seekers say about Milgan</h2>
            <p className="text-foreground/60 text-lg font-serif italic">Busy families, holistic healers, and tastemakers — everyone loves the life-force of our pure Vedic Ghee.</p>
          </div>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            <div className="break-inside-avoid p-10 bg-gold rounded-[2.5rem] space-y-8 text-center group hover:bg-[#e1ddde] transition-all duration-700">
              <div className="text-[#23212e] text-[10px] font-black uppercase tracking-[0.4em]">Heritage Awards</div>
              <div className="text-3xl font-serif font-bold text-[#23212e] tracking-tight">Most Innovative <br /> Artisanal Brand</div>
              <div className="text-5xl">🏆</div>
            </div>
            <div className="break-inside-avoid relative aspect-[4/5] rounded-[2.5rem] overflow-hidden group border border-white/10 shadow-xl">
              <img src="/image/nature.webp" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Customer" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#23212e] via-transparent to-transparent opacity-85" />
              <div className="absolute bottom-10 left-10 right-10 space-y-4">
                <div className="text-gold text-[9px] font-black uppercase tracking-widest opacity-80">Seeker Story</div>
                <h3 className="text-2xl font-serif font-bold text-white">The Sharma Family</h3>
                <p className="text-white/80 text-sm italic">"Milgan has become the heart of our kitchen. Every meal feels like a blessing."</p>
              </div>
            </div>
            <div className="break-inside-avoid p-12 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[2.5rem] text-center space-y-6 hover:bg-white/[0.07] transition-all">
              <div className="text-6xl font-serif font-bold text-gold tracking-tighter leading-none">4.92</div>
              <div className="text-gold text-lg">★★★★★</div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/80">Trusted in thousands of modern kitchens</p>
            </div>
            <div className="break-inside-avoid p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] space-y-6 hover:bg-white/[0.07] transition-all">
              <div className="text-gold text-2xl font-serif italic">“</div>
              <p className="text-foreground/90 font-serif italic leading-relaxed text-xl">"This is not just ghee; it's a sensory journey. The aroma takes me back to my grandmother's kitchen."</p>
              <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-[#23212e] text-[10px] font-black">RV</div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-foreground animate-pulse">Rahul Varma</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-foreground/60">Verified Seeker</div>
                </div>
              </div>
            </div>
            <div className="break-inside-avoid p-10 bg-gold/10 rounded-[2.5rem] space-y-8 hover:bg-gold transition-all duration-700 group">
              <p className="text-foreground group-hover:text-[#23212e] transition-colors text-xl font-serif italic leading-relaxed font-medium">"It's like farm to table, but sacred to table. Milgan solves the search for real purity."</p>
              <div className="space-y-1">
                <div className="text-sm font-bold text-foreground group-hover:text-[#23212e] transition-colors">Sneha Kapur</div>
                <div className="text-[9px] font-black uppercase tracking-widest text-foreground/60 group-hover:text-[#23212e]/60 transition-colors">Wellness Editor</div>
              </div>
            </div>
            <div className="break-inside-avoid relative aspect-square rounded-[2.5rem] overflow-hidden border border-white/10">
              <img src="/image/place_the_ghee_jar_2K_202605141500.jpeg" className="w-full h-full object-cover" alt="Process" />
            </div>
          </div>
        </div>
      </section>

      {/* 5.5 FOUNDER'S MESSAGE */}
      <section className="py-18 md:py-18 relative z-10 bg-transparent border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            {/* Founder Image Card */}
            <div className="relative aspect-square md:aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl group order-last lg:order-first bg-white/[0.03]">
              <img
                src="/image/founder.png"
                className="w-full h-full object-contain object-top transition-transform duration-[3000ms] group-hover:scale-105"
                alt="Anand, Founder of Milgan"
              />
              <div className="absolute inset-0 bg-[#23212e]/30 opacity-0 group-hover:opacity-100 transition-all duration-1000" />
              <div className="absolute bottom-8 left-8 right-8 p-6 bg-gold/90 backdrop-blur-xl border border-white/10 rounded-3xl text-center">
                <span className="text-[10px] font-black text-[#23212e] uppercase tracking-[0.4em]">Anand</span>
                <p className="text-[#23212e]/80 font-serif italic text-xs mt-1">Founder, Milgan Foods</p>
              </div>
            </div>

            {/* Message Narrative */}
            <div className="space-y-8 text-left">
              <div className="space-y-4">
                <span className="text-gold text-[10px] md:text-xs font-black uppercase tracking-[0.8em]">The Vision</span>
                <h2 className="text-4xl md:text-7xl font-serif font-bold text-foreground tracking-tighter leading-[1.1]">A Message of <br /><span className="italic font-light text-gold">Truth.</span></h2>
              </div>
              <div className="space-y-6 text-foreground/80 text-base md:text-lg font-serif leading-relaxed text-justify">
                <p>
                  "When we set out to create Milgan, our goal wasn't to build a business, but to restore a sacred ritual. In a world chasing speed and volume, real purity has become a forgotten whisper."
                </p>
                <p>
                  "Every batch of our ghee carries the warmth of the gentle wood fire, the patience of the Bilona double-direction churn, and the purity of grass-fed cows. We believe that food is not just sustenance—it is a vessel of life-force, or <em>Prana</em>."
                </p>
                <p>
                  "Thank you for welcoming Milgan into your kitchen and trusting us with your health. We promise to never compromise on the slow, honest methods that make our ghee liquid gold."
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-6">
                <div>
                  <p className="font-bold text-foreground text-lg font-serif">Anand</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-foreground/50">Founder & Custodian</p>
                </div>
                <div className="text-3xl text-gold/30 font-serif italic font-light select-none">
                  Anand
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MEDICINAL GOLD (LIQUID WISDOM) */}
      <section className="py-18 md:py-18 relative overflow-hidden bg-transparent">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
          <div className="space-y-12 md:space-y-16 relative z-10">
            <h2 className="text-5xl md:text-9xl font-serif font-bold text-foreground tracking-tighter leading-tight text-center lg:text-left">Liquid <br /><span className="text-gold italic font-light">Wisdom.</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
              {[{ t: 'Immunity', d: 'Natural defense booster' }, { t: 'Brain Fuel', d: 'Rich in healthy acids' }, { t: 'Digestion', d: 'Vedic gut healing' }, { t: 'Skin Radiance', d: 'Inner & outer glow' }].map((b, i) => (
                <div key={i} className="p-8 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2rem] md:rounded-[2.5rem] space-y-4 hover:bg-white/[0.07] hover:border-gold/20 transition-all duration-500 hover:shadow-2xl">
                  <div className="text-gold animate-bounce-slow">✦</div>
                  <h4 className="font-bold text-gold uppercase tracking-widest text-[9px] md:text-[10px]">{b.t}</h4>
                  <p className="text-[10px] md:text-[11px] text-foreground/80 font-medium">{b.d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex justify-center relative"><div className="text-[20rem] animate-float duration-[6s] text-gold/20">🏺</div></div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="py-18 border-y border-white/5 bg-transparent">
        <div className="max-w-4xl mx-auto px-6 space-y-18 text-center">
          <span className="text-gold text-[10px] font-black uppercase tracking-[0.8em]">Seeker's Guide</span>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-foreground tracking-tighter">Wisdom Shared.</h2>
          <div className="space-y-6 text-left">
            {[{ q: "Why Milgan?", a: "Because we honor the silence, the slow cooking, and the ancient Bilona rhythm that modern industries ignore." }, { q: "Purity?", a: "Every drop comes from purebred cows, grass-fed and nurtured in traditional sanctuaries." }, { q: "Preservation?", a: "Pure ghee needs no refrigeration. Store in a cool, dark place to preserve its life force." }].map((faq, i) => (
              <div key={i} className="group border-b border-white/10 transition-all">
                <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="w-full py-12 flex justify-between items-center bg-transparent">
                  <span className="text-2xl md:text-3xl font-serif font-bold text-foreground group-hover:text-gold transition-colors">{faq.q}</span>
                  <span className="text-3xl text-foreground group-hover:text-gold transition-colors">{activeFaq === i ? '−' : '+'}</span>
                </button>
                {activeFaq === i && <div className="pb-12 text-foreground/70 font-serif italic text-xl leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-500">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. MODERN EDITORIAL FOOTER */}
      <footer className="pt-24 pb-20 relative overflow-hidden border-t border-white/5 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-24 md:gap-12">
            <div className="md:col-span-2 space-y-12 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4">
                <img src="/image/milgan logo-0.png" alt="Milgan logo" className="w-12 h-12 object-contain" />
                <h2 className="text-4xl font-serif font-bold text-gold tracking-tighter">Milgan.</h2>
              </div>
              <p className="text-foreground/70 text-xl font-serif italic max-w-sm mx-auto md:mx-0 leading-relaxed">"Honoring the ancient Vedic rhythms of preparation to deliver the purest organic ghee in the world."</p>
            </div>
            <div className="space-y-10 text-center md:text-left">
              <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-foreground/60">The Vault</h4>
              <ul className="space-y-4">{['Collection', 'Legacy', 'Purity', 'Wisdom'].map(item => <li key={item}><Link href="/" className="text-sm font-bold text-foreground hover:text-gold transition-colors">{item}</Link></li>)}</ul>
            </div>
            <div className="space-y-10 text-center md:text-left">
              <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-foreground/60">Control</h4>
              <ul className="space-y-4"><li><Link href="/admin" className="text-sm font-bold text-foreground hover:text-gold transition-colors">Artisan Portal</Link></li><li><Link href="/admin" className="text-sm font-bold text-foreground hover:text-gold transition-colors">Curation Room</Link></li></ul>
            </div>
          </div>
          <div className="mt-20 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-[10px] font-black text-foreground uppercase tracking-[0.5em]">Crafted with Purity in India</div>
            <div className="text-[10px] font-black text-foreground/60 uppercase tracking-[0.4em] text-center md:text-left">© {new Date().getFullYear()} Milgan Organic Alchemy. All rights reserved.</div>
            <div className="flex items-center gap-4"><div className="w-2 h-2 bg-gold rounded-full animate-pulse" /><span className="text-[9px] font-black text-foreground uppercase tracking-[0.3em]">Authenticity Verified</span></div>
          </div>
        </div>
      </footer>

      {/* Gallery Lightbox Modal */}
      {selectedGalleryItem && (
        <div className="fixed inset-0 w-screen h-screen z-[9999] grid place-items-center p-4 sm:p-6 bg-[#23212e]/95 backdrop-blur-xl transition-all duration-500 overflow-y-auto font-sans">
          {/* Click outside to close */}
          <div className="fixed inset-0 cursor-pointer" onClick={() => setSelectedGalleryItem(null)} />

          {/* Main Container */}
          <div className="relative bg-[#23212e] w-full max-w-4xl rounded-[2.5rem] sm:rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.6),0_0_80px_rgba(252,196,51,0.1)] overflow-hidden transition-all duration-700 border border-white/10 animate-in zoom-in-95 duration-500 flex flex-col lg:flex-row max-h-[90vh] lg:max-h-none">

            {/* Close Button */}
            <button
              onClick={() => setSelectedGalleryItem(null)}
              className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-white/10 text-white border border-white/10 flex items-center justify-center text-xl font-bold hover:bg-gold hover:text-[#23212e] hover:scale-105 active:scale-95 transition-all shadow-lg"
              title="Close Modal"
            >
              ×
            </button>

            {/* Left: Image */}
            <div className="lg:w-1/2 p-6 sm:p-10 flex flex-col justify-center bg-white/[0.01] border-b lg:border-b-0 lg:border-r border-white/5 overflow-hidden shrink-0">
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-white/[0.03] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/5">
                <img
                  src={selectedGalleryItem.image}
                  alt={selectedGalleryItem.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right: Details */}
            <div className="lg:w-1/2 p-6 sm:p-10 lg:p-12 overflow-y-auto space-y-6 flex flex-col justify-center">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black text-gold uppercase tracking-[0.5em]">{selectedGalleryItem.category}</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground tracking-tighter leading-tight">
                  {selectedGalleryItem.title}
                </h2>
                <p className="text-foreground/80 font-serif italic text-base sm:text-lg leading-relaxed pt-2">
                  {selectedGalleryItem.description}
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center gap-4">
                <div className="text-gold text-2xl">🌿</div>
                <div className="h-px flex-1 bg-white/10" />
                <div className="text-[8px] font-black uppercase tracking-[0.3em] text-gold">Pure Vedic Tradition</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
