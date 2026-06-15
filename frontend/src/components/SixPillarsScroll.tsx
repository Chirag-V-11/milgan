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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % INGREDIENT_BENEFITS.length);
    }, 2000); // Auto-slide every 2 seconds
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };

  const scrollProgress = activeIndex / (INGREDIENT_BENEFITS.length - 1);

  return (
    <section
      className="relative w-full min-h-[750px] md:h-[650px] bg-transparent text-white overflow-hidden py-12 flex items-center justify-center border-t border-white/5 z-10"
      id="six-pillars-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
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

      {/* DESKTOP VIEWPORT: AUTO SLIDING CAROUSEL GRID */}
      <div className="hidden md:block relative w-full z-10">
        <div className="w-full flex items-center justify-center relative max-w-7xl mx-auto px-8 lg:px-12">
          
          <div className="grid grid-cols-11 gap-8 lg:gap-16 w-full items-center relative h-[530px]">
            
            {/* COLUMN 1-5: PHOTO SLIDER */}
            <div className="col-span-5 flex flex-col justify-between h-full relative select-none">
              
              {/* Slide Wrapper */}
              <div className="relative flex-1 w-full flex items-center justify-center">
                {INGREDIENT_BENEFITS.map((ing, idx) => {
                  const isActive = activeIndex === idx;
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col items-center justify-center absolute inset-0 transition-all duration-[800ms] cubic-bezier(0.16, 1, 0.3, 1) ${
                        isActive
                          ? 'opacity-100 pointer-events-auto scale-100'
                          : 'opacity-0 pointer-events-none scale-95'
                      }`}
                    >
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
                      <div className="text-center mt-6 space-y-2 z-10 min-h-[90px] w-full">
                        <h3 className="text-2xl font-serif font-bold text-amber-500 tracking-tight">{ing.name}</h3>
                        <p className="text-[10px] text-white/50 font-serif italic font-medium">{ing.botanical}</p>
                        <div className="mt-2 inline-block px-3 py-0.5 bg-white/[0.03] border border-white/10 rounded-full text-[8px] font-black uppercase tracking-wider text-amber-500">
                          {ing.role}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* HORIZONTAL PROGRESS BAR (LIGHT WHITE) */}
              <div className="relative w-64 h-8 flex items-center justify-between mx-auto z-20">
                <div className="absolute left-0 right-0 h-[2px] bg-white/10 rounded-full" />
                <div
                  className="absolute left-0 h-[2px] bg-white/30 rounded-full transition-all duration-500"
                  style={{
                    width: `${scrollProgress * 100}%`
                  }}
                />
                
                <div className="absolute left-0 right-0 flex justify-between items-center py-1">
                  {INGREDIENT_BENEFITS.map((_, i) => {
                    const isDotActive = activeIndex === i;
                    const isPast = activeIndex > i;
                    return (
                      <button
                        key={i}
                        onClick={() => handleDotClick(i)}
                        className="group relative flex items-center justify-center w-6 h-6 focus:outline-none cursor-pointer"
                        title={`Go to pillar ${i + 1}`}
                      >
                        <div className={`w-2 h-2 rounded-full border transition-all duration-500 ${
                          isDotActive
                            ? 'bg-white border-white scale-125 shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                            : isPast
                              ? 'bg-white/40 border-white/40'
                              : 'bg-white/10 border-white/10 hover:border-white/30'
                        }`} />
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* COLUMN 6-11: STATIC DETAILS VIEW */}
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
                      {INGREDIENT_BENEFITS[activeIndex].action}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[7.5px] font-black uppercase tracking-widest text-white/40 block">Medicinal Virtues</span>
                    <div className="space-y-3.5">
                      {INGREDIENT_BENEFITS[activeIndex].benefits.map((benefit, bIdx) => (
                        <div
                          key={bIdx}
                          className={`flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 transition-all duration-500 shadow-sm ${INGREDIENT_BENEFITS[activeIndex].textGlow}`}
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

        </div>

        {/* BOTTOM AUTO-PLAY CUE */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-45 hover:opacity-80 transition-opacity duration-300 pointer-events-none">
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/50">Hover to pause auto-slide</span>
        </div>
      </div>

      {/* MOBILE VIEWPORT: COMPACT AUTO SLIDING CAROUSEL */}
      <div className="block md:hidden relative w-full z-10 min-h-[660px]">
        <div className="w-full flex flex-col justify-center px-6 py-4 relative">
          
          {/* Header */}
          <div className="text-center space-y-2 mb-4 mt-2">
            <span className="text-amber-500 text-[8px] font-black uppercase tracking-[0.5em]">Synergistic Wellness</span>
            <h2 className="text-2xl font-serif font-bold text-white tracking-tight">
              The Alchemy of <span className="italic font-light text-amber-500">Six Pillars.</span>
            </h2>
          </div>

          {/* Photo & Identity Carousel */}
          <div className="relative h-[260px] w-full flex items-center justify-center">
            {INGREDIENT_BENEFITS.map((ing, idx) => {
              const isActive = activeIndex === idx;
              return (
                <div
                  key={idx}
                  className={`absolute inset-0 flex flex-col justify-center items-center gap-3 transition-all duration-700 ease-in-out ${
                    isActive
                      ? 'opacity-100 scale-100 translate-y-0'
                      : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
                  }`}
                >
                  {/* Floating Glass Orb */}
                  <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-white/10 to-white/[0.02] border border-white/10 shadow-lg flex items-center justify-center p-4 relative">
                    <img
                      src={ing.image}
                      alt={ing.name}
                      className="w-18 h-18 object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] animate-float"
                    />
                    <div className="absolute top-1 right-2.5 text-base font-serif font-black text-white/10">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                  </div>

                  {/* Identification */}
                  <div className="text-center">
                    <h3 className="text-lg font-serif font-bold text-amber-500 tracking-tight">{ing.name}</h3>
                    <p className="text-[8px] text-white/50 font-serif italic mt-0.5">{ing.botanical}</p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-[6.5px] font-black uppercase tracking-wider">
                      {ing.role}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress Indicator just below photos */}
          <div className="flex justify-center gap-2 mt-4 mb-4">
            {INGREDIENT_BENEFITS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  activeIndex === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/20'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Static Details at the bottom */}
          <div className="space-y-4">
            {/* Ayurvedic Action Card */}
            <div className="w-full text-center p-3 bg-white/[0.03] rounded-xl border border-white/5">
              <span className="text-[6.5px] font-black uppercase tracking-widest text-white/40 block mb-0.5">Ayurvedic Action</span>
              <p className="text-xs font-serif italic text-white/90 font-medium">
                {INGREDIENT_BENEFITS[activeIndex].action}
              </p>
            </div>

            {/* Medicinal Virtues */}
            <div className="w-full space-y-2">
              <span className="text-[6.5px] font-black uppercase tracking-widest text-white/40 block">Medicinal Virtues</span>
              <div className="space-y-1.5">
                {INGREDIENT_BENEFITS[activeIndex].benefits.map((benefit, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-amber-500 text-[10px] flex-shrink-0">✦</span>
                    <span className="text-white/85 font-serif text-[10px] leading-snug">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
