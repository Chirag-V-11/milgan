"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

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
    <div className="min-h-screen bg-transparent text-[#124B70] font-sans selection:bg-[#124B70] selection:text-[#fce389] overflow-x-clip scroll-smooth relative">

      {/* Glistening Atmosphere (Subtle overlay for depth) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[60%] bg-white/20 rounded-full blur-[120px] animate-pulse duration-[10s]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[50%] bg-[#ffdb71]/40 rounded-full blur-[100px] animate-pulse duration-[8s] delay-1000" />
      </div>

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 h-1 bg-[#124B70] z-[100] transition-all duration-300" style={{ width: `${scrollProgress}%` }} />

      {/* 1. MINIMALIST TYPOGRAPHIC HERO */}
      <section className="relative h-[100vh] flex items-center justify-center overflow-hidden bg-[#fdce47]">
        <div className="absolute inset-0 z-0 bg-transparent" />

        <div className="relative z-10 text-center space-y-12 md:space-y-16 px-6 max-w-7xl translate-y-8 md:translate-y-12">
          <div className="space-y-4 md:space-y-6 flex flex-col items-center">
            <div className="flex items-center justify-center">
              {/* Mobile View Logo */}
              <img
                src="/image/milgan logo-1.png"
                alt="Milgan Logo"
                className="block sm:hidden w-full max-w-[20rem] min-[375px]:max-w-[23rem] object-contain select-none animate-in fade-in zoom-in duration-700"
                style={{ filter: "brightness(0) saturate(100%) invert(19%) sepia(21%) saturate(2377%) hue-rotate(193deg) brightness(93%) contrast(92%)" }}
              />
              {/* Desktop View Logo */}
              <img
                src="/image/milgan side logo-2.png"
                alt="Milgan Kannada Logo"
                className="hidden sm:block w-full max-w-[44rem] sm:max-w-[48rem] object-contain select-none animate-in fade-in duration-1000"
                style={{ filter: "brightness(0) saturate(100%) invert(19%) sepia(21%) saturate(2377%) hue-rotate(193deg) brightness(93%) contrast(92%)" }}
              />
            </div>

            {/* Tagline */}
            <div className="flex items-center justify-center gap-3 md:gap-4 text-[#006639] animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
              <div className="h-px w-4 md:w-6 bg-[#006639]" />
              <span className="text-[10px] min-[375px]:text-xs md:text-xl font-black uppercase tracking-[0.25em] min-[375px]:tracking-[0.4em] whitespace-nowrap">
                Fresh <span className="inline-block mx-1 md:mx-2 w-[2px] h-2.5 md:h-4.5 bg-[#006639] align-middle" /> Pure <span className="inline-block mx-1 md:mx-2 w-[2px] h-2.5 md:h-4.5 bg-[#006639] align-middle" /> Delicious
              </span>
              <div className="h-px w-4 md:w-6 bg-[#006639]" />
            </div>
          </div>
          <button onClick={() => document.getElementById('boutique')?.scrollIntoView({ behavior: 'smooth' })} className="group relative px-12 md:px-16 py-5 md:py-7 bg-[#124B70] text-[#FDFDFD] rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_8px_30px_rgba(18,75,112,0.4)] font-black uppercase tracking-[0.5em] text-[9px] md:text-[10px] border border-[#124B70]">
            <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative z-10 transition-colors">Enter Sanctuary</span>
          </button>
        </div>
      </section>

      {/* 3. STAGGERED BOUTIQUE GALLERY */}
      <section id="boutique" className="pt-18 pb-24 md:pt-18 md:pb-18 relative scroll-mt-24 overflow-hidden bg-gold-gradient">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[20vw] font-serif font-black text-[#124B70]/[0.03] select-none pointer-events-none whitespace-nowrap tracking-tighter">
          COLLECTION COLLECTION COLLECTION
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-24 md:space-y-10 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto">
            <span className="text-[#124B70]/70 text-[10px] font-black uppercase tracking-[0.8em]">Artisanal Selection</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#124B70] tracking-tighter leading-tight italic">Liquid Gold, <span className="not-italic text-3xl md:text-5xl tracking-[0.5px] headline-stroke-green">Captured.</span></h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pb-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-[4/5] rounded-[2.5rem] md:rounded-[3rem] bg-white/20 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pb-4 max-w-6xl mx-auto">
              {products.map((product: any, i: number) => {
                const firstOption = product.quantity_options && product.quantity_options.length > 0 ? product.quantity_options[0] : null;
                const baseCost = product.price || (firstOption ? (firstOption.baseCost || firstOption.price) : 0);
                const discount = firstOption ? (firstOption.discountPercentage || 0) : 0;
                const finalPrice = discount > 0 ? Math.round(baseCost * (1 - discount / 100)) : baseCost;

                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group transition-all duration-700 cursor-pointer flex flex-col justify-between w-full"
                  >
                    <div
                      className="block relative aspect-[4/5] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden bg-white/10 backdrop-blur-md border border-[#124B70]/10 shadow-[0_8px_30px_rgba(18,75,112,0.05)] group-hover:shadow-[0_15px_40px_rgba(18,75,112,0.15)] transition-all duration-700 w-full"
                    >
                      <img
                        src={product.image_url || product.image || "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1000"}
                        className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                        alt={product.name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#124B70]/90 via-[#124B70]/30 to-transparent opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                      <div className="absolute top-3 left-3 md:top-8 md:left-8">
                        <span className="px-3 py-1 md:px-5 md:py-2 bg-[#124B70] backdrop-blur-md rounded-full text-[7px] md:text-[9px] font-black uppercase tracking-wider md:tracking-widest text-[#fdce47] border border-[#124B70]/20 whitespace-nowrap shadow-sm">
                          {product.category || 'Limited Stock'}
                        </span>
                      </div>

                      <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 translate-y-0 md:translate-y-10 opacity-100 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-700 space-y-4 md:space-y-6">
                        <div className="space-y-2">
                          <h3 className="text-2xl md:text-4xl font-serif font-bold text-white tracking-tight">{product.name}</h3>
                          <p className="text-white/80 text-xs md:text-sm italic line-clamp-2">{product.description}</p>
                        </div>
                        <div className="pt-4 border-t border-white/20">
                          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#fdce47] transition-colors">
                            Acquire Curation ➔
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 space-y-2">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-lg font-serif font-bold text-[#124B70] group-hover:text-[#124B70]/80 transition-colors">{product.name}</h3>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <div className="w-1.5 h-1.5 bg-[#124B70] rounded-full animate-pulse" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-[#124B70]/60">Limited Batch</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="px-3 py-1 bg-[#10751e]/10 text-[#10751e] rounded-full text-xl font-serif font-black shadow-sm">
                          ₹{finalPrice}
                        </span>
                        {discount > 0 && (
                          <span className="text-sm text-[#124B70]/50 line-through font-semibold">₹{baseCost}</span>
                        )}
                      </div>
                      <div className="h-px w-full bg-[#124B70]/10" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Sanctuary Gallery */}
          <div className="pt-24 pb-20 px-8 md:px-16 bg-white/30 backdrop-blur-xl rounded-[3.5rem] border border-white/45 shadow-[0_15px_45px_rgba(18,75,112,0.03)] space-y-16 mt-24">
            <div className="flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto">
              <span className="text-[#124B70]/70 text-[10px] font-black uppercase tracking-[0.8em]">Frames of Devotion</span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#124B70] tracking-tighter leading-tight italic">Sanctuary <span className="not-italic text-3xl md:text-7xl tracking-[0.5px] headline-stroke-gold-gallery">Gallery.</span></h2>
              <p className="text-[#124B70]/70 text-sm font-serif italic max-w-md">Take a visual journey through our slow, sacred churning process and the pristine environments where we craft our liquid gold.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pb-4 max-w-6xl mx-auto">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedGalleryItem(item)}
                  className="group transition-all duration-700 cursor-pointer flex flex-col justify-between w-full"
                >
                  <div className="block relative aspect-[3/2] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-white/10 backdrop-blur-md border border-[#124B70]/10 shadow-[0_8px_30px_rgba(18,75,112,0.05)] group-hover:shadow-[0_15px_40px_rgba(18,75,112,0.15)] transition-all duration-700 w-full">
                    <img
                      src={item.image}
                      className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                      alt={item.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#124B70]/80 via-[#124B70]/20 to-transparent opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-1.5 bg-[#124B70] backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-[#fdce47] border border-[#124B70]/20 whitespace-nowrap shadow-sm">
                        {item.category}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 translate-y-0 md:translate-y-6 opacity-100 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-700 space-y-1 md:space-y-2">
                      <h3 className="text-lg md:text-xl font-serif font-bold text-white tracking-tight">{item.title}</h3>
                      <p className="text-white/80 text-[10px] md:text-xs italic line-clamp-2 leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2">
                    <h3 className="text-lg font-serif font-bold text-[#124B70] group-hover:text-[#124B70]/80 transition-colors">{item.title}</h3>
                    <p className="text-xs text-[#124B70]/70 font-serif italic line-clamp-2 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. ARTISAN WALL OF TRUST */}
      <section className="py-18 relative overflow-hidden bg-gold-gradient">
        <div className="max-w-7xl mx-auto px-6 space-y-18">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-7xl font-serif font-bold text-[#124B70] tracking-tighter leading-tight">What <span className="not-italic text-3xl md:text-7xl tracking-[0.5px] headline-stroke-navy-translucent">seekers</span> say about Milgan</h2>
            <p className="text-[#124B70]/70 text-lg font-serif italic">Busy families, holistic healers, and tastemakers — everyone loves the life-force of our pure Vedic Ghee.</p>
          </div>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            <div className="break-inside-avoid p-10 bg-[#124B70] rounded-[2.5rem] space-y-8 text-center group hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(18,75,112,0.3)] transition-all duration-500 shadow-[0_8px_30px_rgba(18,75,112,0.15)]">
              <div className="text-[#ffdb71]/80 text-[10px] font-black uppercase tracking-[0.4em]">Heritage Awards</div>
              <div className="text-3xl font-serif font-bold text-white tracking-tight">Most Innovative <br /> Artisanal Brand</div>
              <div className="text-5xl drop-shadow-sm">🏆</div>
            </div>
            <a
              href="https://youtu.be/OhfpbErg0l8?si=RuRqWAWHQQDfOduh"
              target="_blank"
              rel="noopener noreferrer"
              className="block break-inside-avoid relative aspect-[4/5] rounded-[2.5rem] overflow-hidden group border border-[#124B70]/10 shadow-[0_8px_30px_rgba(18,75,112,0.05)] hover:scale-[1.01] transition-all duration-500"
            >
              <img src="/image/nature.webp" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Customer" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#124B70] via-[#124B70]/60 to-transparent opacity-95" />
              <div className="absolute bottom-10 left-10 right-10 space-y-4">
                <div className="text-[#ffdb71] text-[9px] font-black uppercase tracking-widest opacity-90">Seeker Story</div>
                <h3 className="text-2xl font-serif font-bold text-white">The Milgan Family</h3>
                <p className="text-white/80 text-sm italic">"Milgan has become the heart of our kitchen. Every meal feels like a blessing."</p>
              </div>
            </a>
            <div className="break-inside-avoid p-12 bg-white/30 backdrop-blur-md border border-[#124B70]/15 rounded-[2.5rem] text-center space-y-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-500 shadow-[0_8px_30px_rgba(18,75,112,0.05)]">
              <div className="text-6xl font-serif font-bold text-[#124B70] tracking-tighter leading-none">4.92</div>
              <div className="text-[#124B70]/80 text-lg drop-shadow-sm">★★★★★</div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#124B70]/60">Trusted in thousands of modern kitchens</p>
            </div>
            <div className="break-inside-avoid p-10 bg-white/30 backdrop-blur-md border border-[#124B70]/15 rounded-[2.5rem] space-y-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-500 shadow-[0_8px_30px_rgba(18,75,112,0.05)]">
              <div className="text-6xl font-serif font-bold text-[#124B70] tracking-tighter leading-none">“</div>
              <p className="text-[#124B70] font-serif italic leading-relaxed text-xl">"This is not just ghee; it's a sensory journey. The aroma takes me back to my grandmother's kitchen."</p>
              <div className="flex items-center gap-4 pt-4 border-t border-[#124B70]/10">
                <div className="w-10 h-10 bg-[#124B70] rounded-full flex items-center justify-center text-[#ffdb71] text-[10px] font-black border border-[#124B70] shadow-sm">RV</div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[#124B70] animate-pulse">Rahul Varma</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-[#124B70]/60">Verified Seeker</div>
                </div>
              </div>
            </div>
            <div className="break-inside-avoid p-10 bg-white/25 backdrop-blur-md border border-[#124B70]/15 rounded-[2.5rem] space-y-8 hover:-translate-y-1 hover:shadow-xl transition-all duration-500 shadow-[0_8px_30px_rgba(18,75,112,0.05)] group">
              <p className="text-[#124B70]/90 group-hover:text-[#124B70] transition-colors text-xl font-serif italic leading-relaxed font-medium">"It's like farm to table, but sacred to table. Milgan solves the search for real purity."</p>
              <div className="space-y-1">
                <div className="text-sm font-bold text-[#124B70] transition-colors">Sneha Kapur</div>
                <div className="text-[9px] font-black uppercase tracking-widest text-[#124B70]/70 transition-colors">Wellness Editor</div>
              </div>
            </div>
            <div className="break-inside-avoid relative aspect-square rounded-[2.5rem] overflow-hidden border border-[#124B70]/10 shadow-[0_8px_30px_rgba(18,75,112,0.05)]">
              <img src="/image/place_the_ghee_jar_2K_202605141500.jpeg" className="w-full h-full object-cover" alt="Process" />
            </div>
          </div>
        </div>
      </section>

      {/* 5.5 FOUNDER'S MESSAGE */}
      <section className="py-18 md:py-18 relative z-10 bg-gold-gradient">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            {/* Founder Image Card */}
            <div className="relative aspect-square md:aspect-[4/5] rounded-[3rem] overflow-hidden border border-[#124B70]/10 shadow-[0_10px_40px_rgba(18,75,112,0.1)] group order-last lg:order-first bg-white/10 backdrop-blur-sm">
              <img
                src="/image/founder.png"
                className="w-full h-full object-contain object-top transition-transform duration-[3000ms] group-hover:scale-105"
                alt="Anand, Founder of Milgan"
              />
              <div className="absolute inset-0 bg-[#124B70]/5 opacity-0 group-hover:opacity-100 transition-all duration-1000" />
              <div className="absolute bottom-8 left-8 right-8 p-6 bg-[#124B70]/90 backdrop-blur-xl border border-[#124B70]/20 rounded-3xl text-center shadow-[0_8px_30px_rgba(18,75,112,0.15)]">
                <span className="text-[10px] font-black text-[#ffdb71] uppercase tracking-[0.4em]">Anand</span>
                <p className="text-white/80 font-serif italic text-xs mt-1">Founder, Milgan Foods</p>
              </div>
            </div>

            {/* Message Narrative */}
            <div className="space-y-8 text-left">
              <div className="space-y-4">
                <span className="text-[#124B70]/70 text-[10px] md:text-xs font-black uppercase tracking-[0.8em]">The Vision</span>
                <h2 className="text-3xl md:text-7xl font-serif font-bold text-[#124B70] tracking-tighter leading-[1.1]">A Message of <br className="hidden md:block" /><span className="not-italic text-3xl md:text-7xl tracking-[0.5px] headline-stroke-green-truth">Truth.</span></h2>
              </div>
              <div className="space-y-6 text-[#124B70]/80 text-base md:text-lg font-serif leading-relaxed text-left md:text-justify">
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

              <div className="pt-6 border-t border-[#124B70]/10 flex items-center justify-between gap-6">
                <div>
                  <p className="font-bold text-[#124B70] text-lg font-serif">Anand</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#124B70]/70">Founder & Custodian</p>
                </div>
                <div className="text-3xl text-[#124B70]/20 font-serif italic font-light select-none">
                  Anand
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MEDICINAL GOLD (LIQUID WISDOM) */}
      <section className="py-18 md:py-18 relative overflow-hidden bg-gold-gradient">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
          <div className="space-y-12 md:space-y-16 relative z-10">
            <h2 className="text-3xl md:text-9xl font-serif font-bold text-[#124B70] tracking-tighter leading-tight text-center lg:text-left">Liquid <br className="hidden lg:block" /><span className="not-italic text-3xl md:text-9xl tracking-[0.5px] headline-stroke-wisdom">Wisdom.</span></h2>
            <div className="grid grid-cols-2 gap-4 md:gap-8">
              {[{ t: 'Immunity', d: 'Natural defense booster' }, { t: 'Brain Fuel', d: 'Rich in healthy acids' }, { t: 'Digestion', d: 'Vedic gut healing' }, { t: 'Skin Radiance', d: 'Inner & outer glow' }].map((b, i) => (
                <div key={i} className="p-5 sm:p-8 bg-white/30 backdrop-blur-md border border-[#124B70]/15 rounded-[2rem] md:rounded-[2.5rem] space-y-4 hover:-translate-y-1 hover:shadow-xl transition-all duration-500 shadow-[0_8px_30px_rgba(18,75,112,0.05)]">
                  <div className="text-[#124B70] animate-bounce-slow drop-shadow-sm">✦</div>
                  <h4 className="font-bold text-[#124B70] uppercase tracking-widest text-[9px] md:text-[10px]">{b.t}</h4>
                  <p className="text-[10px] md:text-[11px] text-[#124B70]/80 font-medium">{b.d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex justify-center relative"><div className="text-[20rem] animate-float duration-[6s] text-[#124B70]/10 drop-shadow-2xl">🏺</div></div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="py-12 bg-gold-gradient">
        <div className="max-w-4xl mx-auto px-6 space-y-8 text-center">
          <span className="text-[#124B70]/70 text-[10px] font-black uppercase tracking-[0.8em]">Seeker's Guide</span>
          <h2 className="text-3xl md:text-6xl font-serif font-bold text-[#124B70] tracking-tighter">Wisdom <span className="not-italic text-3xl md:text-6xl tracking-[0.5px] headline-stroke-faq">Shared.</span></h2>
          <div className="space-y-1 text-left">
            {[{ q: "Why Milgan?", a: "Because we honor the silence, the slow cooking, and the ancient Bilona rhythm that modern industries ignore." }, { q: "Purity?", a: "Every drop comes from purebred cows, grass-fed and nurtured in traditional sanctuaries." }, { q: "Preservation?", a: "Pure ghee needs no refrigeration. Store in a cool, dark place to preserve its life force." }].map((faq, i) => (
              <div key={i} className="group border-b border-[#124B70]/10 transition-all">
                <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="w-full py-5 flex justify-between items-center bg-transparent text-left">
                  <span className="text-xl md:text-2xl font-serif font-bold text-[#124B70] group-hover:text-[#124B70]/70 transition-colors">{faq.q}</span>
                  <span className="text-2xl text-[#124B70] group-hover:text-[#124B70]/70 transition-colors">{activeFaq === i ? '−' : '+'}</span>
                </button>
                {activeFaq === i && <div className="pb-6 text-[#124B70]/70 font-serif italic text-lg leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-500">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer is now globally rendered by ClientLayout.tsx */}

      {/* Gallery Lightbox Modal */}
      {selectedGalleryItem && (
        <div className="fixed inset-0 w-screen h-screen z-[9999] grid place-items-center p-4 sm:p-6 bg-gradient-to-b from-[#fdce47]/95 via-[#ffdb71]/95 to-[#f1f5f7]/95 backdrop-blur-xl transition-all duration-500 overflow-y-auto font-sans">
          {/* Click outside to close */}
          <div className="fixed inset-0 cursor-pointer" onClick={() => setSelectedGalleryItem(null)} />

          {/* Main Container */}
          <div className="relative bg-[#FDFDFD] w-full max-w-4xl rounded-[2.5rem] sm:rounded-[3.5rem] shadow-[0_30px_60px_rgba(18,75,112,0.15),0_0_80px_rgba(18,75,112,0.05)] overflow-hidden transition-all duration-700 border border-[#124B70]/10 animate-in zoom-in-95 duration-500 flex flex-col lg:flex-row max-h-[90vh] lg:max-h-none">

            {/* Close Button */}
            <button
              onClick={() => setSelectedGalleryItem(null)}
              className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-[#124B70] text-white border border-[#124B70]/80 flex items-center justify-center text-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-md"
              title="Close Modal"
            >
              ×
            </button>

            {/* Left: Image */}
            <div className="lg:w-1/2 p-6 sm:p-10 flex flex-col justify-center bg-white border-b lg:border-b-0 lg:border-r border-[#124B70]/10 overflow-hidden shrink-0">
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-[#124B70]/5">
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
                  <span className="text-[9px] font-black text-[#124B70]/70 uppercase tracking-[0.5em]">{selectedGalleryItem.category}</span>
                  <div className="h-px flex-1 bg-[#124B70]/10" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#124B70] tracking-tighter leading-tight">
                  {selectedGalleryItem.title}
                </h2>
                <p className="text-[#124B70]/80 font-serif italic text-base sm:text-lg leading-relaxed pt-2">
                  {selectedGalleryItem.description}
                </p>
              </div>

              <div className="pt-6 border-t border-[#124B70]/10 flex items-center gap-4">
                <div className="text-[#124B70] text-2xl drop-shadow-sm">🌿</div>
                <div className="h-px flex-1 bg-[#124B70]/10" />
                <div className="text-[8px] font-black uppercase tracking-[0.3em] text-[#124B70]/70">Pure Vedic Tradition</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}