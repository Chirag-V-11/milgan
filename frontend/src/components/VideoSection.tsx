"use client";
import React, { useRef, useState } from 'react';

// The main video section — embedded YouTube player with cinematic surrounding design
export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Reveal the actual iframe when user clicks play
  const handlePlay = () => {
    setIsPlaying(true);
  };

  const videoData = [
    {
      icon: '🏺',
      label: 'Ancient Method',
      description: 'Bilona churning preserved over generations',
    },
    {
      icon: '🌿',
      label: 'Pure Ingredients',
      description: 'From indigenous grass-fed Gir & Sahiwal cows',
    },
    {
      icon: '🔥',
      label: 'Slow Cook',
      description: 'Hours of patience, zero shortcuts',
    },
    {
      icon: '✨',
      label: 'Sacred Result',
      description: 'Liquid gold with prana intact',
    },
  ];

  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-[#124B70]">
      {/* Deep blue ambient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[70%] bg-[#0a2f45] rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[55%] bg-[#fdce47]/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[#0d3a52]/50 rounded-full blur-[160px]" />
      </div>

      {/* Floating decorative text */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[18vw] font-serif font-black text-white/[0.025] select-none pointer-events-none whitespace-nowrap tracking-tighter">
        MILGAN STORY MILGAN STORY
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 space-y-16 md:space-y-20">

        {/* Section Header */}
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-8 bg-[#fdce47]/60" />
            <span className="text-[#fdce47] text-[10px] font-black uppercase tracking-[0.8em]">Watch the Story</span>
            <div className="h-px w-8 bg-[#fdce47]/60" />
          </div>
          <h2 className="text-4xl md:text-7xl font-serif font-bold text-white tracking-tighter leading-tight">
            The Art of{' '}
            <span className="text-[#fdce47] italic">Sacred</span>
            <br className="hidden md:block" /> Crafting.
          </h2>
          <p className="text-white/60 text-base md:text-lg font-serif italic leading-relaxed max-w-2xl mx-auto">
            Step into our world — from the tranquil pastures of indigenous cows to the meditative rhythm of the Bilona churn, and the golden moment of clarity.
          </p>
        </div>

        {/* Main Video Player */}
        <div
          className="relative max-w-5xl mx-auto"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Glow ring behind the video */}
          <div className="absolute -inset-1 md:-inset-3 rounded-[2.5rem] md:rounded-[3.5rem] bg-gradient-to-r from-[#fdce47]/20 via-[#fdce47]/30 to-[#fdce47]/20 blur-xl opacity-70 transition-opacity duration-700" />

          {/* Video Frame */}
          <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-[#fdce47]/20 shadow-[0_30px_80px_rgba(0,0,0,0.5)] bg-black aspect-video">

            {!isPlaying ? (
              /* Thumbnail / Play Overlay */
              <div className="absolute inset-0 w-full h-full">
                {/* Thumbnail background */}
                <img
                  src="/image/place_the_ghee_jar_2K_202605141500.webp"
                  alt="Milgan Ghee - Watch Story"
                  className="w-full h-full object-cover"
                />

                {/* Dark cinematic gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

                {/* Play button */}
                <button
                  onClick={handlePlay}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-5 group cursor-pointer"
                  aria-label="Play video"
                >
                  {/* Pulse rings */}
                  <div className="relative">
                    <div className="absolute -inset-4 rounded-full bg-[#fdce47]/20 animate-ping" />
                    <div className="absolute -inset-2 rounded-full bg-[#fdce47]/10 animate-pulse" />
                    {/* Play circle */}
                    <div className={`relative w-20 h-20 md:w-28 md:h-28 rounded-full bg-[#fdce47] flex items-center justify-center shadow-[0_0_40px_rgba(253,206,71,0.5)] transition-all duration-500 ${isHovering ? 'scale-110 shadow-[0_0_60px_rgba(253,206,71,0.7)]' : ''}`}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="w-8 h-8 md:w-12 md:h-12 ml-1 text-[#124B70]"
                      >
                        <path d="M5 3l14 9L5 21V3z" fill="currentColor" />
                      </svg>
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <p className="text-white font-black text-sm md:text-base uppercase tracking-[0.3em]">Play Story</p>
                    <p className="text-white/50 text-[10px] font-semibold tracking-widest uppercase">3 min • The Milgan Journey</p>
                  </div>
                </button>

                {/* Bottom caption bar */}
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 flex items-end justify-between">
                  <div className="space-y-1">
                    <div className="text-[#fdce47] text-[9px] font-black uppercase tracking-[0.5em]">Featured Film</div>
                    <h3 className="text-white font-serif font-bold text-lg md:text-2xl">The Milgan Family</h3>
                  </div>
                  <div className="text-white/40 text-[9px] font-black uppercase tracking-widest text-right">
                    <div>Vedic Tradition</div>
                    <div>2024</div>
                  </div>
                </div>
              </div>
            ) : (
              /* Actual YouTube embed — autoplay triggers when iframe loads */
              <iframe
                ref={iframeRef}
                className="w-full h-full absolute inset-0"
                src="https://www.youtube.com/embed/OhfpbErg0l8?autoplay=1&rel=0&modestbranding=1&color=white"
                title="Milgan Foods - The Milgan Family Story"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            )}
          </div>
        </div>

        {/* Video Feature Highlights — 4 columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          {videoData.map((item, i) => (
            <div
              key={i}
              className="group p-5 md:p-7 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl md:rounded-3xl text-center space-y-3 hover:bg-white/10 hover:border-[#fdce47]/30 hover:-translate-y-1 transition-all duration-500"
            >
              <div className="text-3xl md:text-4xl drop-shadow-md group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <div>
                <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-1">
                  {item.label}
                </h4>
                <p className="text-white/50 text-[10px] font-serif italic leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA below video */}
        <div className="text-center space-y-4">
          <a
            href="https://www.youtube.com/@MilganFoods-b2b7p"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 border border-[#fdce47]/40 text-[#fdce47] rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#fdce47] hover:text-[#124B70] transition-all duration-300 group"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
            </svg>
            <span>More Videos on YouTube</span>
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
