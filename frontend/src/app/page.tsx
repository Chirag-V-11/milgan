"use client";
import React, { useEffect, useState } from 'react';
import ProductCard from "@/components/ProductCard";
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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
    <main className="min-h-screen bg-transparent font-sans selection:bg-forest/30 overflow-x-hidden scroll-smooth relative">

      {/* Glistening Atmosphere over Gold */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[60%] bg-white/20 rounded-full blur-[120px] animate-pulse duration-[10s]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[50%] bg-forest/10 rounded-full blur-[100px] animate-pulse duration-[8s] delay-1000" />
      </div>

      {/* Scroll Progress Bar (Inverted for Gold) */}
      <div className="fixed top-0 left-0 h-1 bg-forest z-[100] transition-all duration-300" style={{ width: `${scrollProgress}%` }} />

      {/* 1. MINIMALIST TYPOGRAPHIC HERO */}
      <section className="relative h-[100vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#FDC333] via-[#FDE17A] to-[#FCE38A]">
        <div className="absolute inset-0 z-0 bg-transparent" />

        <div className="relative z-10 text-center space-y-12 md:space-y-16 px-6 max-w-7xl translate-y-8 md:translate-y-12">
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-[18vw] md:text-[15vw] font-serif font-black text-forest tracking-tighter leading-[0.7] select-none">MILGAN</h1>
            <div className="flex items-center justify-center gap-2 md:gap-6">
              <div className="h-px w-6 sm:w-12 md:w-20 bg-forest" />
              <p className="text-forest text-[8px] sm:text-[10px] md:text-sm font-black uppercase tracking-[0.3em] md:tracking-[0.8em] whitespace-nowrap">Fresh | Pure | Delicious</p>
              <div className="h-px w-6 sm:w-12 md:w-20 bg-forest" />
            </div>
          </div>
          <button onClick={() => document.getElementById('boutique')?.scrollIntoView({ behavior: 'smooth' })} className="group relative px-12 md:px-16 py-5 md:py-7 bg-forest text-white rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl">
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative z-10 text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] group-hover:text-forest transition-colors">Enter Sanctuary</span>
          </button>
        </div>
      </section>

      {/* 2. PILLARS */}
      <section className="py-20 relative z-10 bg-gradient-to-b from-[#FCE38A] to-[#FCFCFC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[{ title: 'Ancient Bilona', icon: '🏺' }, { title: 'A2 Heritage', icon: '🌿' }, { title: 'Small Batch', icon: '✨' }, { title: 'Forest Fed', icon: '🐄' }].map((p, i) => (
              <div key={i} className="p-8 md:p-12 bg-white/20 backdrop-blur-md rounded-[2.5rem] md:rounded-[3rem] border border-white/30 flex flex-col items-center justify-center space-y-6 md:space-y-8 group hover:bg-white/40 transition-all duration-700 hover:-translate-y-2">
                <div className="text-4xl md:text-6xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 inline-block animate-float" style={{ animationDelay: `${i * 0.5}s` }}>{p.icon}</div>
                <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-forest group-hover:text-forest transition-colors text-center">{p.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. STAGGERED BOUTIQUE GALLERY */}
      <section id="boutique" className="py-24 md:py-48 relative border-y border-forest/10 scroll-mt-24 overflow-hidden bg-gradient-to-b from-[#FCFCFC] via-[#FDFBF7] to-[#FCE38A]">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[20vw] font-serif font-black text-forest/[0.05] select-none pointer-events-none whitespace-nowrap tracking-tighter">
          COLLECTION COLLECTION COLLECTION
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-24 md:space-y-32 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto">
            <span className="text-forest text-[10px] font-black uppercase tracking-[0.8em]">Artisanal Selection</span>
            <h2 className="text-4xl md:text-8xl font-serif font-bold text-forest tracking-tighter leading-tight italic">Liquid Gold, <br /><span className="text-[#D49800] not-italic">Captured.</span></h2>
          </div>

          {loading ? (
            <div className="flex overflow-x-auto gap-6 md:grid md:grid-cols-3 md:gap-12 pb-4 scrollbar-none">
              {[1, 2, 3, 4].map(i => <div key={i} className="flex-shrink-0 w-[85%] md:w-auto aspect-[4/5] rounded-[2.5rem] md:rounded-[3rem] bg-forest/5 animate-pulse" />)}
            </div>
          ) : (
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-6 md:grid md:grid-cols-12 md:gap-16 pb-4">
              {products.map((product: any, i: number) => {
                const isLarge = i % 3 === 0;
                // Calculate display price and discount from nested quantity options
                const firstOption = product.quantity_options && product.quantity_options.length > 0 ? product.quantity_options[0] : null;
                const baseCost = product.price || (firstOption ? (firstOption.baseCost || firstOption.price) : 0);
                const discount = firstOption ? (firstOption.discountPercentage || 0) : 0;
                const finalPrice = discount > 0 ? Math.round(baseCost * (1 - discount / 100)) : baseCost;

                return (
                  <div
                    key={product.id}
                    className={`
                      flex-shrink-0 w-[85%] snap-center md:w-auto group transition-all duration-1000
                      ${isLarge ? 'md:col-span-8' : 'md:col-span-4'}
                      ${i % 2 === 1 ? 'md:mt-24' : 'md:mt-0'}
                    `}
                  >
                    <Link
                      href={`/product/${product.id}`}
                      className="block relative aspect-[4/5] md:aspect-auto md:h-[600px] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 shadow-sm group-hover:shadow-2xl transition-all duration-700"
                    >
                      <img
                        src={product.image_url || product.image || "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1000"}
                        className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                        alt={product.name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                      <div className="absolute top-8 left-8">
                        <span className="px-5 py-2 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-forest border border-forest/5">
                          {product.category || 'Limited Stocks'}
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
                    </Link>

                    <div className="mt-8 space-y-3 group-hover:opacity-0 transition-opacity duration-500">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-xl font-serif font-bold text-forest">{product.name}</h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="w-1.5 h-1.5 bg-forest rounded-full animate-pulse" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-forest">Limited Batch available</span>
                        </div>
                      </div>
                      <div className="h-px w-full bg-white/30" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 2.5 ABOUT US (THE HERITAGE) */}
      <section className="py-24 md:py-40 relative z-10 bg-gradient-to-b from-[#FCE38A] to-[#FCFCFC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="relative aspect-square md:aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/30 shadow-2xl group">
              <img
                src="image/image.png"
                className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-105"
                alt="Vedic Churning Process"
              />
              <div className="absolute inset-0 bg-forest/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl">
                <p className="text-white font-serif italic text-sm md:text-base leading-relaxed shadow-sm">
                  "Every jar is a testament to patience. We don't just make ghee; we preserve a 5,000-year-old ritual."
                </p>
              </div>
            </div>
            <div className="space-y-10 md:space-y-12">
              <div className="space-y-4">
                <span className="text-white text-[10px] md:text-xs font-black uppercase tracking-[0.8em]">Our Legacy</span>
                <h2 className="text-5xl md:text-7xl font-serif font-bold text-forest tracking-tighter leading-[1.1]">The Return to <br /><span className="italic font-light">Purity.</span></h2>
              </div>
              <div className="space-y-6 text-forest/80 text-lg md:text-xl font-serif leading-relaxed">
                <p>
                  Milgan was born out of a longing for the truth. In a world of mass production and forgotten roots, we chose the harder, slower path.
                </p>
                <p>
                  We partner exclusively with indigenous farms where purebred A2 Gir cows graze freely in sunlit pastures. We follow the sacred Bilona method—curding the milk, churning it in two directions before dawn, and slow-cooking the makhan over a gentle wood fire.
                </p>
                <p className="font-bold text-forest">
                  The result is not merely an ingredient, but liquid life force. This is our promise. This is Milgan.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-8">
                <div className="text-forest text-4xl">🌿</div>
                <div className="h-px flex-1 bg-white/30" />
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-forest">Since Time Immemorial</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MEDICINAL GOLD */}
      <section className="py-24 md:py-40 relative overflow-hidden bg-gradient-to-b from-[#FCFCFC] via-[#FDC333] to-[#E59500]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
          <div className="space-y-12 md:space-y-16 relative z-10">
            <h2 className="text-5xl md:text-9xl font-serif font-bold text-forest tracking-tighter leading-tight text-center lg:text-left">Liquid <br /><span className="text-white italic font-light">Wisdom.</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
              {[{ t: 'Immunity', d: 'Natural defense booster' }, { t: 'Brain Fuel', d: 'Rich in healthy acids' }, { t: 'Digestion', d: 'Vedic gut healing' }, { t: 'Skin Radiance', d: 'Inner & outer glow' }].map((b, i) => (
                <div key={i} className="p-8 bg-white/20 backdrop-blur-xl border border-white/30 rounded-[2rem] md:rounded-[2.5rem] space-y-4 hover:bg-white/40 transition-all duration-500 hover:shadow-2xl">
                  <div className="text-forest animate-bounce-slow">✦</div>
                  <h4 className="font-bold text-forest uppercase tracking-widest text-[9px] md:text-[10px]">{b.t}</h4>
                  <p className="text-[10px] md:text-[11px] text-forest font-medium">{b.d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex justify-center relative"><div className="text-[20rem] animate-float duration-[6s] text-forest">🏺</div></div>
        </div>
      </section>

      {/* 5. ARTISAN WALL OF TRUST */}
      <section className="py-40 relative overflow-hidden border-t border-forest/10 bg-gradient-to-b from-[#E59500] via-[#FCE38A] to-[#FCFCFC]">
        <div className="max-w-7xl mx-auto px-6 space-y-24">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-serif font-bold text-forest tracking-tighter">What seekers say about Milgan</h2>
            <p className="text-forest/60 text-lg font-serif italic">Busy families, holistic healers, and tastemakers — everyone loves the life-force of our pure A2 Vedic Ghee.</p>
          </div>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            <div className="break-inside-avoid p-10 bg-forest rounded-[2.5rem] space-y-8 text-center group hover:bg-white transition-all duration-700">
              <div className="text-white group-hover:text-forest transition-colors text-[10px] font-black uppercase tracking-[0.4em]">Heritage Awards</div>
              <div className="text-3xl font-serif font-bold text-white group-hover:text-forest tracking-tight transition-colors">Most Innovative <br /> Artisanal Brand</div>
              <div className="text-5xl">🏆</div>
            </div>
            <div className="break-inside-avoid relative aspect-[4/5] rounded-[2.5rem] overflow-hidden group border border-white/20 shadow-xl">
              <img src="/image/nature.webp" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Customer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-10 left-10 right-10 space-y-4">
                <div className="text-white text-[9px] font-black uppercase tracking-widest opacity-60">Seeker Story</div>
                <h3 className="text-2xl font-serif font-bold text-white">The Sharma Family</h3>
                <p className="text-white/80 text-sm italic">"Milgan has become the heart of our kitchen. Every meal feels like a blessing."</p>
              </div>
            </div>
            <div className="break-inside-avoid p-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-[2.5rem] text-center space-y-6 hover:bg-white/40 transition-all">
              <div className="text-6xl font-serif font-bold text-forest tracking-tighter leading-none">4.92</div>
              <div className="text-forest text-lg">★★★★★</div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-forest">Trusted in thousands of modern kitchens</p>
            </div>
            <div className="break-inside-avoid p-10 bg-white/20 border border-white/30 rounded-[2.5rem] space-y-6 hover:bg-white/40 transition-all">
              <div className="text-forest text-2xl font-serif italic">“</div>
              <p className="text-forest font-serif italic leading-relaxed text-xl">"This is not just ghee; it's a sensory journey. The aroma takes me back to my grandmother's kitchen."</p>
              <div className="flex items-center gap-4 pt-4 border-t border-forest/10">
                <div className="w-10 h-10 bg-forest rounded-full flex items-center justify-center text-white text-[10px] font-black">RV</div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-forest">Rahul Varma</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-forest/60">Verified Seeker</div>
                </div>
              </div>
            </div>
            <div className="break-inside-avoid p-10 bg-forest/10 rounded-[2.5rem] space-y-8 hover:bg-forest transition-all duration-700 group">
              <p className="text-forest group-hover:text-white transition-colors text-xl font-serif italic leading-relaxed font-medium">"It's like farm to table, but sacred to table. Milgan solves the search for real A2 purity."</p>
              <div className="space-y-1">
                <div className="text-sm font-bold text-forest group-hover:text-white transition-colors">Sneha Kapur</div>
                <div className="text-[9px] font-black uppercase tracking-widest text-forest group-hover:text-white transition-colors">Wellness Editor</div>
              </div>
            </div>
            <div className="break-inside-avoid relative aspect-square rounded-[2.5rem] overflow-hidden border border-white/20">
              <img src="/image/place_the_ghee_jar_2K_202605141500.jpeg" className="w-full h-full object-cover" alt="Process" />
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="py-40 border-y border-forest/10 bg-[#FCFCFC]">
        <div className="max-w-4xl mx-auto px-6 space-y-24 text-center">
          <span className="text-forest text-[10px] font-black uppercase tracking-[0.8em]">Seeker's Guide</span>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-forest tracking-tighter">Wisdom Shared.</h2>
          <div className="space-y-6 text-left">
            {[{ q: "Why Milgan?", a: "Because we honor the silence, the slow cooking, and the ancient Bilona rhythm that modern industries ignore." }, { q: "A2 Purity?", a: "Every drop comes from purebred Gir cows, grass-fed and nurtured in traditional sanctuaries." }, { q: "Preservation?", a: "Pure ghee needs no refrigeration. Store in a cool, dark place to preserve its life force." }].map((faq, i) => (
              <div key={i} className="group border-b border-forest/10 transition-all">
                <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="w-full py-12 flex justify-between items-center bg-transparent">
                  <span className="text-2xl md:text-3xl font-serif font-bold text-forest group-hover:text-[#D49800] transition-colors">{faq.q}</span>
                  <span className="text-3xl text-forest group-hover:text-[#D49800] transition-colors">{activeFaq === i ? '−' : '+'}</span>
                </button>
                {activeFaq === i && <div className="pb-12 text-forest/70 font-serif italic text-xl leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-500">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. MODERN EDITORIAL FOOTER */}
      <footer className="pt-24 pb-20 relative overflow-hidden border-t border-forest/10 bg-gradient-to-b from-[#FCFCFC] to-[#FCE38A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-24 md:gap-12">
            <div className="md:col-span-2 space-y-12 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4">
                <div className="w-12 h-12 bg-forest rounded-full flex items-center justify-center text-white font-black text-xl">M</div>
                <h2 className="text-4xl font-serif font-bold text-forest tracking-tighter">Milgan.</h2>
              </div>
              <p className="text-forest/70 text-xl font-serif italic max-w-sm mx-auto md:mx-0 leading-relaxed">"Honoring the ancient Vedic rhythms of preparation to deliver the purest organic ghee in the world."</p>
            </div>
            <div className="space-y-10 text-center md:text-left">
              <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-forest/60">The Vault</h4>
              <ul className="space-y-4">{['Collection', 'Legacy', 'Purity', 'Wisdom'].map(item => <li key={item}><Link href="/" className="text-sm font-bold text-forest hover:text-[#D49800] transition-colors">{item}</Link></li>)}</ul>
            </div>
            <div className="space-y-10 text-center md:text-left">
              <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-forest/60">Control</h4>
              <ul className="space-y-4"><li><Link href="/admin" className="text-sm font-bold text-forest hover:text-[#D49800] transition-colors">Artisan Portal</Link></li><li><Link href="/admin" className="text-sm font-bold text-forest hover:text-[#D49800] transition-colors">Curation Room</Link></li></ul>
            </div>
          </div>
          <div className="mt-40 pt-12 border-t border-forest/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-[10px] font-black text-forest uppercase tracking-[0.5em]">Crafted with Purity in India</div>
            <div className="text-[10px] font-black text-forest/60 uppercase tracking-[0.4em] text-center md:text-left">© {new Date().getFullYear()} Milgan Organic Alchemy. All rights reserved.</div>
            <div className="flex items-center gap-4"><div className="w-2 h-2 bg-forest rounded-full animate-pulse" /><span className="text-[9px] font-black text-forest uppercase tracking-[0.3em]">Authenticity Verified</span></div>
          </div>
        </div>
      </footer>
    </main>
  );
}
