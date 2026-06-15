"use client";
import React, { useEffect, useState, useRef } from 'react';

const PARTICLE_COUNT = 36;

interface Particle {
  id: number;
  style: React.CSSProperties;
}

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show preloader on every page refresh to guarantee visibility
    setIsVisible(true);

    // Add scroll lock class to body
    document.body.classList.add('antigravity-scroll-lock');

    // Generate random particle parameters for the swirl effect
    const generatedParticles = Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
      const startAngle = Math.random() * 360;
      // Swirl around 180 to 540 degrees
      const endAngle = startAngle + 180 + Math.random() * 360;
      const orbitRadius = 65 + Math.random() * 75; // Orbit radius on desktop/tablet
      const size = 1.5 + Math.random() * 3.5;
      const delay = Math.random() * 0.4; // Emerge within first 0.4s
      const duration = 0.6 + Math.random() * 0.9;

      return {
        id: i,
        style: {
          '--start-angle': `${startAngle}deg`,
          '--end-angle': `${endAngle}deg`,
          '--orbit-radius': `${orbitRadius}px`,
          width: `${size}px`,
          height: `${size}px`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
        } as React.CSSProperties,
      };
    });
    setParticles(generatedParticles);

    // Progress counter animation (0.8s to 3.2s)
    const startTime = Date.now();
    const delayDuration = 300; // start loading ring after 0.3s
    const loadingDuration = 1000; // count up for 1.0s (ends at 1.3s)

    let frameId: number;
    const animateProgress = () => {
      const elapsed = Date.now() - startTime;

      if (elapsed < delayDuration) {
        setProgress(0);
        frameId = requestAnimationFrame(animateProgress);
      } else if (elapsed < delayDuration + loadingDuration) {
        const pct = (elapsed - delayDuration) / loadingDuration;
        // Ease out quad for smooth slowdown near 100%
        const easePct = 1 - (1 - pct) * (1 - pct);
        setProgress(Math.min(99, Math.round(easePct * 100)));
        frameId = requestAnimationFrame(animateProgress);
      } else {
        setProgress(100);
      }
    };

    frameId = requestAnimationFrame(animateProgress);

    // Timeline actions:
    // At 3.2s (100% progress), progress completes. The sweep animation triggers in CSS.
    // At 4.0s, the animations finish. We start fading out the preloader container.
    const fadeTimer = setTimeout(() => {
      setIsFinished(true);
      // Remove scroll lock class from body once done
      document.body.classList.remove('antigravity-scroll-lock');
    }, 1500);

    // At 2.1s, remove the preloader completely from DOM
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2100);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
      document.body.classList.remove('antigravity-scroll-lock');
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  // Calculate SVG stroke offset: r=85, circumference = 2 * PI * 85 = 534.07
  const strokeCircumference = 534.07;
  const strokeDashoffset = strokeCircumference - (progress / 100) * strokeCircumference;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#23212e] transition-opacity duration-600 ease-in-out select-none pointer-events-auto ${isFinished ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
    >
      <div className="relative w-80 h-80 flex items-center justify-center">

        {/* Glow backdrop behind logo */}
        <div className="absolute w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse duration-[3s]" />

        {/* Swirling Liquid Particles */}
        <div className="absolute inset-0 pointer-events-none preloader-gooey-filter">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute left-1/2 top-1/2 rounded-full bg-white/90 preloader-swirl-particle"
              style={p.style}
            />
          ))}
        </div>

        {/* SVG Loading Ring & Trails */}
        <svg
          className="absolute w-72 h-72 rotate-[-90deg] preloader-loading-svg"
          viewBox="0 0 200 200"
        >
          <defs>
            <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.05)" />
              <stop offset="50%" stopColor="rgba(255, 255, 255, 0.4)" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
          </defs>

          {/* Static Track Ring */}
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="rgba(255, 255, 255, 0.03)"
            strokeWidth="1.5"
          />

          {/* Active Progress Ring */}
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="url(#silverGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            style={{
              strokeDasharray: strokeCircumference,
              strokeDashoffset: strokeDashoffset,
              transition: 'stroke-dashoffset 0.1s ease-out',
            }}
          />
        </svg>

        {/* Logo Container with Liquid Morph & Shimmer Reveal */}
        <div className="relative w-44 h-44 flex items-center justify-center preloader-logo-morph shine-effect">
          <img
            src="/image/milgan logo-0.png"
            alt="Milgan Logo"
            className="w-full h-full object-contain filter brightness-0 invert"
          />
        </div>

        {/* Elegant Progress Text Counter */}
        {/* <div className="absolute bottom-6 flex flex-col items-center gap-1">
          <span className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">
            Sanctuary Loading
          </span>
          <span className="text-xs font-mono font-bold text-white/80 tracking-wider">
            {progress}%
          </span>
        </div> */}

      </div>

      {/* SVG Gooey Filter definition (only used for liquid morphing of swirling particles) */}
      <svg className="absolute w-0 h-0 invisible">
        <defs>
          <filter id="preloader-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
