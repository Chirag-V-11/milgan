"use client";
import React, { useState, useEffect, useRef } from 'react';

const INGREDIENT_BENEFITS = [
  {
    name: 'Elaichi',
    botanical: 'Elettaria cardamomum',
    role: 'Aroma & Digestion',
    image: '/image/elachi.png',
    action: 'Tridoshic (Balances Vata, Pitta, & Kapha)',
    benefits: [
      'Ignites the digestive fire (Agni) without causing acidity.',
      'Acts as a natural carminative to reduce bloating and gas.',
      'Provides a sweet, soothing aroma that relaxes the nervous system.'
    ],
    color: 'emerald',
    glowClass: 'from-emerald-500/10 to-teal-500/5',
    textGlow: 'shadow-emerald-500/5 hover:border-emerald-500/30'
  },
  {
    name: 'Pepper',
    botanical: 'Piper nigrum',
    role: 'Vital Warmth & Bioavailability',
    image: '/image/pepper.png',
    action: 'Deeply Warming (Pitta-stimulating in moderation)',
    benefits: [
      'Contains Piperine, which increases the bioavailability of other herbs.',
      'Stimulates gastric juices for complete nutrient absorption.',
      'Helps clear congestion and supports respiratory wellness.'
    ],
    color: 'amber',
    glowClass: 'from-amber-600/10 to-orange-500/5',
    textGlow: 'shadow-amber-500/5 hover:border-amber-500/30'
  },
  {
    name: 'Methi',
    botanical: 'Trigonella foenum-graecum',
    role: 'Gut Balance & Metabolism',
    image: '/image/methi.png',
    action: 'Pacifies Vata & Kapha',
    benefits: [
      'Nourishes the stomach lining and reduces acid reflux.',
      'Supports natural blood sugar regulation and metabolic rate.',
      'Rich in soluble fiber which aids in lubricating the digestive tract.'
    ],
    color: 'yellow',
    glowClass: 'from-yellow-500/10 to-amber-500/5',
    textGlow: 'shadow-yellow-500/5 hover:border-yellow-500/30'
  },
  {
    name: 'Clove',
    botanical: 'Syzygium aromaticum',
    role: 'Antioxidant & Protection',
    image: '/image/clove.png',
    action: 'Heating & Clarifying',
    benefits: [
      'Loaded with Eugenol, a potent antioxidant for cellular health.',
      'Helps naturally preserve the ghee and maintain freshness.',
      'Supports oral hygiene and boosts overall immunity.'
    ],
    color: 'rose',
    glowClass: 'from-rose-700/10 to-red-500/5',
    textGlow: 'shadow-rose-500/5 hover:border-rose-700/30'
  },
  {
    name: 'Betel Leaf',
    botanical: 'Piper betle',
    role: 'Detoxification & Clarification',
    image: '/image/beetel.png',
    action: 'Highly Alkaline & Cleansing',
    benefits: [
      'Historically used to clarify ghee, removing impurities perfectly.',
      'Stimulates saliva and digestive enzymes for immediate gut activation.',
      'Provides antioxidant support and acts as a natural cleanser.'
    ],
    color: 'green',
    glowClass: 'from-green-500/10 to-emerald-500/5',
    textGlow: 'shadow-green-500/5 hover:border-green-500/30'
  },
  {
    name: 'Turmeric',
    botanical: 'Curcuma longa',
    role: 'Golden Healing & Immunity',
    image: '/image/turmeric.png',
    action: 'Anti-inflammatory & Blood Purifier',
    benefits: [
      'Provides Curcumin, a world-renowned anti-inflammatory compound.',
      'Builds robust immunity and speeds up internal tissue repair.',
      'Nourishes skin from within, promoting a healthy radiant glow.'
    ],
    color: 'amber',
    glowClass: 'from-amber-500/15 to-orange-500/5',
    textGlow: 'shadow-amber-500/5 hover:border-amber-500/30'
  }
];

export default function SixPillarsScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleWindowScroll = () => {
      if (!containerRef.current) return;

      const element = containerRef.current;
      const rect = element.getBoundingClientRect();
      const sectionHeight = rect.height;
      const maxScrollDistance = sectionHeight - window.innerHeight;

      // Calculate relative scroll progression within the boundaries of this section
      const relativeProgress = -rect.top;

      if (relativeProgress >= 0 && relativeProgress <= maxScrollDistance) {
        const progressionPercentage = relativeProgress / maxScrollDistance;
        setScrollProgress(progressionPercentage);

        // Segment progression evenly into the 6 ingredients
        const targetIndex = Math.floor(progressionPercentage * INGREDIENT_BENEFITS.length);
        const clampedIndex = Math.max(0, Math.min(INGREDIENT_BENEFITS.length - 1, targetIndex));

        setActiveIndex(clampedIndex);
      } else if (relativeProgress < 0) {
        setScrollProgress(0);
        setActiveIndex(0);
      } else if (relativeProgress > maxScrollDistance) {
        setScrollProgress(1);
        setActiveIndex(INGREDIENT_BENEFITS.length - 1);
      }
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    window.addEventListener('resize', handleWindowScroll, { passive: true });
    handleWindowScroll();

    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
      window.removeEventListener('resize', handleWindowScroll);
    };
  }, []);

  const handleDotClick = (index: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const absoluteSectionTop = window.scrollY + rect.top;
    const sectionHeight = rect.height;
    const maxScrollDistance = sectionHeight - window.innerHeight;

    // Scroll the window to the exact segment start offset
    const targetScrollPosition = absoluteSectionTop + (index / (INGREDIENT_BENEFITS.length - 1)) * maxScrollDistance;

    window.scrollTo({
      top: targetScrollPosition,
      behavior: 'smooth'
    });
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[400vh] md:h-[600vh] bg-transparent text-white"
      id="six-pillars-section"
    >
      {/* BACKGROUND ACCENT GLOWS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {INGREDIENT_BENEFITS.map((ing, idx) => (
          <div
            key={idx}
            className={`absolute top-[10%] left-[10%] w-[80%] h-[80%] bg-gradient-to-tr ${ing.glowClass} rounded-full blur-[160px] transition-opacity duration-1000 ease-in-out ${
              activeIndex === idx ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {/* DESKTOP VIEWPORT: STICKY GRID CYCLED BY PAGE SCROLL */}
      <div className="hidden md:block sticky top-0 h-screen w-full overflow-hidden z-10">
        <div className="h-full w-full flex items-center relative max-w-7xl mx-auto px-8 lg:px-12">
          
          <div className="grid grid-cols-12 gap-8 lg:gap-16 w-full items-center relative h-[500px]">

            {/* COLUMN 1: PROGRESS SIDEBAR (STATIC, OUTSIDE LOOP) */}
            <div className="col-span-1 flex flex-col items-center justify-center h-[320px] relative z-20">
              <div className="absolute top-0 bottom-0 w-[2px] bg-white/10 rounded-full" />

              {/* Progress indicator bar filling mechanism */}
              <div
                className="absolute top-0 w-[2px] bg-amber-500 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                style={{
                  height: `${scrollProgress * 100}%`,
                  transformOrigin: 'top'
                }}
              />

              <div className="absolute top-0 bottom-0 flex flex-col justify-between items-center z-10 py-1">
                {INGREDIENT_BENEFITS.map((_, i) => {
                  const isDotActive = activeIndex === i;
                  const isPast = activeIndex > i;
                  return (
                    <button
                      key={i}
                      onClick={() => handleDotClick(i)}
                      className="group relative flex items-center justify-center w-8 h-8 rounded-full focus:outline-none cursor-pointer"
                      title={`Go to pillar ${i + 1}`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-500 flex items-center justify-center ${
                        isDotActive
                          ? 'bg-amber-500 border-amber-500 scale-125 shadow-[0_0_12px_rgba(245,158,11,0.8)]'
                          : isPast
                            ? 'bg-amber-500/30 border-amber-500/40'
                            : 'bg-[#23212e]/80 border-white/20 hover:border-white/50'
                      }`}>
                        <div className={`w-1 h-1 rounded-full bg-[#23212e] transition-opacity duration-300 ${isDotActive ? 'opacity-100' : 'opacity-0'}`} />
                      </div>

                      <span className="absolute left-10 text-[9px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-amber-500 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 whitespace-nowrap bg-[#23212e]/90 px-2.5 py-1.5 rounded-md border border-white/5">
                        {String(i + 1).padStart(2, '0')} — {INGREDIENT_BENEFITS[i].name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DYNAMIC CARD VIEWPORTS CONTAINER (col-span-11) */}
            <div className="col-span-11 relative h-full w-full flex items-center">
              {INGREDIENT_BENEFITS.map((ing, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`grid grid-cols-11 gap-8 lg:gap-16 w-full items-center absolute inset-0 transition-all duration-[800ms] cubic-bezier(0.16, 1, 0.3, 1) ${
                      isActive
                        ? 'opacity-100 pointer-events-auto translate-x-0 scale-100'
                        : 'opacity-0 pointer-events-none translate-x-8 scale-95'
                    }`}
                  >
                    
                    {/* COLUMN 2: LEFT VISUAL SHOWCASE */}
                    <div className="col-span-5 flex flex-col items-center justify-center relative select-none">
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none overflow-hidden z-0">
                        <span className="text-[15rem] lg:text-[18rem] font-serif font-black text-white/[0.02] tracking-tighter">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>

                      {/* ROTATING INGREDIENT BOX WINDOW */}
                      <div className="relative w-72 h-72 lg:w-80 lg:h-80 z-10 flex items-center justify-center">
                        <div className="absolute inset-[-4px] rounded-full border border-white/5 bg-gradient-to-tr from-white/5 to-transparent blur-[2px] transition-transform duration-1000 animate-[spin_10s_linear_infinite]" />

                        <div className="w-full h-full rounded-full bg-gradient-to-br from-white/10 to-white/[0.01] border border-white/15 shadow-[inset_0_4px_16px_rgba(255,255,255,0.08),0_12px_24px_rgba(0,0,0,0.5)] flex items-center justify-center p-10 backdrop-blur-md relative overflow-hidden group">
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none opacity-80" />
                          <div className="opacity-100 scale-100 rotate-0 filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-all duration-700">
                            <img
                              src={ing.image}
                              alt={ing.name}
                              className="w-36 h-36 lg:w-44 lg:h-44 object-contain transform hover:scale-105 transition-transform duration-500 animate-float"
                            />
                          </div>
                        </div>
                      </div>

                      {/* INGREDIENT DESCRIPTOR OVERVIEW */}
                      <div className="text-center mt-8 space-y-2.5 z-10 min-h-[110px] w-full">
                        <h3 className="text-3xl font-serif font-bold text-amber-500 tracking-tight">{ing.name}</h3>
                        <p className="text-xs text-white/50 font-serif italic font-medium">{ing.botanical}</p>
                        <div className="mt-3.5 inline-block px-3.5 py-1 bg-white/[0.03] border border-white/10 rounded-full text-[9px] font-black uppercase tracking-wider text-amber-500">
                          {ing.role}
                        </div>
                      </div>
                    </div>

                    {/* COLUMN 3: RIGHT DETAILS VIEW */}
                    <div className="col-span-6 flex flex-col justify-center relative min-h-[460px] pl-4 lg:pl-8">
                      <div className="mb-8 space-y-2 z-10">
                        <span className="text-amber-500 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.6em]">Synergistic Wellness</span>
                        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white tracking-tighter leading-none">
                          The Alchemy of <span className="italic font-light text-amber-500">Six Pillars.</span>
                        </h2>
                      </div>

                      <div className="relative w-full h-[320px]">
                        <div className="space-y-5">
                          <div className="p-4 bg-white/[0.03] border-l-[3px] border-amber-500 rounded-r-2xl border-y border-r border-white/5 backdrop-blur-sm shadow-sm">
                            <span className="text-[7.5px] font-black uppercase tracking-widest text-white/40 block mb-1">Ayurvedic Action</span>
                            <p className="text-sm font-serif italic text-white/90 font-medium">
                              {ing.action}
                            </p>
                          </div>

                          <div className="space-y-3">
                            <span className="text-[7.5px] font-black uppercase tracking-widest text-white/40 block">Medicinal Virtues</span>
                            <div className="space-y-3.5">
                              {ing.benefits.map((benefit, bIdx) => (
                                <div
                                  key={bIdx}
                                  className={`flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 transition-all duration-500 shadow-sm ${ing.textGlow}`}
                                  style={{
                                    transitionDelay: `${bIdx * 80}ms`
                                  }}
                                >
                                  <span className="text-amber-500 text-xs mt-0.5 flex-shrink-0 animate-pulse">✦</span>
                                  <span className="text-white/80 font-serif text-xs md:text-sm leading-relaxed">{benefit}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* BOTTOM SCROLL PROMPT */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-45 hover:opacity-80 transition-opacity duration-300 pointer-events-none">
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/50">Scroll down to see next pillar</span>
          <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center p-1 mt-0.5">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" />
          </div>
        </div>
      </div>

      {/* MOBILE VIEWPORT: COMPACT STICKY VIEWPORTS LINKED TO ACTUAL PAGE SCROLL */}
      <div className="block md:hidden sticky top-0 h-screen w-full overflow-hidden z-10">
        <div className="h-full w-full flex flex-col justify-center px-6 py-8 relative">
          
          {/* Header */}
          <div className="text-center space-y-2 mb-6 mt-2">
            <span className="text-amber-500 text-[8px] font-black uppercase tracking-[0.5em]">Synergistic Wellness</span>
            <h2 className="text-2xl font-serif font-bold text-white tracking-tight">
              The Alchemy of <span className="italic font-light text-amber-500">Six Pillars.</span>
            </h2>
          </div>

          {/* Dynamic Mobile Card stack (cross-fading absolute elements) */}
          <div className="relative flex-1 w-full flex items-center justify-center">
            {INGREDIENT_BENEFITS.map((ing, idx) => {
              const isActive = activeIndex === idx;
              return (
                <div
                  key={idx}
                  className={`absolute inset-0 flex flex-col justify-center items-center gap-4 transition-all duration-700 ease-in-out ${
                    isActive
                      ? 'opacity-100 scale-100 translate-y-0'
                      : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
                  }`}
                >
                  {/* Floating Glass Orb */}
                  <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-white/10 to-white/[0.02] border border-white/10 shadow-lg flex items-center justify-center p-5 relative">
                    <img
                      src={ing.image}
                      alt={ing.name}
                      className="w-20 h-20 object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] animate-float"
                    />
                    <div className="absolute top-1 right-2.5 text-lg font-serif font-black text-white/10">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                  </div>

                  {/* Identification */}
                  <div className="text-center">
                    <h3 className="text-xl font-serif font-bold text-amber-500 tracking-tight">{ing.name}</h3>
                    <p className="text-[9px] text-white/50 font-serif italic mt-0.5">{ing.botanical}</p>
                    <span className="inline-block mt-1.5 px-3 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-[7px] font-black uppercase tracking-wider">
                      {ing.role}
                    </span>
                  </div>

                  {/* Ayurvedic Action Card */}
                  <div className="w-full text-center p-3 bg-white/[0.02] rounded-xl border border-white/5">
                    <span className="text-[6.5px] font-black uppercase tracking-widest text-white/40 block mb-0.5">Ayurvedic Action</span>
                    <p className="text-xs font-serif italic text-white/90 font-medium">
                      {ing.action}
                    </p>
                  </div>

                  {/* Medicinal Virtues */}
                  <div className="w-full space-y-2">
                    <span className="text-[6.5px] font-black uppercase tracking-widest text-white/40 block">Medicinal Virtues</span>
                    <div className="space-y-1.5">
                      {ing.benefits.map((benefit, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2 p-2.5 rounded-xl bg-[#23212e]/55 border border-white/5">
                          <span className="text-amber-500 text-[10px] flex-shrink-0">✦</span>
                          <span className="text-white/85 font-serif text-[10px] leading-snug">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Horizontal dot progress indicators for mobile */}
          <div className="flex justify-center gap-2 mt-6">
            {INGREDIENT_BENEFITS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeIndex === idx ? 'w-5 bg-amber-500' : 'w-1.5 bg-white/20'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
