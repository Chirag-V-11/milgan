"use client";
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Preloader from '../components/Preloader';
import CartDrawer from '../components/CartDrawer';
import FloatingSocials from '../components/FloatingSocials';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  const isProductPage = pathname?.startsWith('/product');
  const isHomePage = pathname === '/';
  const [isPreloading, setIsPreloading] = useState(true);

  useEffect(() => {
    if (!isAdminPage) {
      document.body.classList.add('client-body');
    } else {
      document.body.classList.remove('client-body');
    }
  }, [isAdminPage]);

  useEffect(() => {
    if (isHomePage) {
      const startTime = Date.now();
      const minDuration = 1500;

      const handleLoaded = () => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minDuration - elapsed);
        setTimeout(() => {
          setIsPreloading(false);
        }, remaining);
      };

      window.addEventListener('milgan-products-loaded', handleLoaded);

      const fallbackTimer = setTimeout(() => {
        setIsPreloading(false);
      }, 5000);

      return () => {
        window.removeEventListener('milgan-products-loaded', handleLoaded);
        clearTimeout(fallbackTimer);
      };
    } else {
      const timer = setTimeout(() => {
        setIsPreloading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isHomePage]);

  // Apply pt-24 top padding to non-admin, non-home pages to push their content below the fixed navbar.
  // Home page starts at y=0 so the full-screen hero section gradient extends behind the floating navbar.
  const paddingClass = !isAdminPage && !isHomePage ? "pt-24" : "";
  const bgClass = "";
  const mainClassName = [paddingClass, bgClass].filter(Boolean).join(" ");

  return (
    <>
      <Preloader />
      {!isAdminPage && !isPreloading && (
        <>
          <Navbar />
          <CartDrawer />
          <FloatingSocials />
        </>
      )}
      <main className={`${mainClassName || ""} relative z-10`}>
        {children}
      </main>
      {!isAdminPage && !isPreloading && (
        <>
          {/* 7. MODERN EDITORIAL FOOTER */}
          <footer className="pt-24 pb-20 relative overflow-hidden bg-transparent">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-24 md:gap-12">
                <div className="md:col-span-2 space-y-12 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <img src="/image/milgan logo-0.png" alt="Milgan logo" className="w-12 h-12 object-contain" style={{ filter: "brightness(0) saturate(100%) invert(19%) sepia(21%) saturate(2377%) hue-rotate(193deg) brightness(93%) contrast(92%)" }} />
                    <h2 className="text-4xl font-serif font-bold text-[#124B70] tracking-tighter">Milgan.</h2>
                  </div>
                  <p className="text-[#124B70]/70 text-xl font-serif italic max-w-sm mx-auto md:mx-0 leading-relaxed">"Honoring the ancient Vedic rhythms of preparation to deliver the purest natural ghee in the world."</p>
                </div>
                <div className="space-y-10 text-center md:text-left">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#124B70]/70">The Vault</h4>
                  <ul className="space-y-4">{['Collection', 'Legacy', 'Purity', 'Wisdom'].map(item => <li key={item}><Link href="/" className="text-sm font-bold text-[#124B70] hover:text-[#124B70]/70 transition-colors">{item}</Link></li>)}</ul>
                </div>
              </div>
              <div className="mt-20 pt-12 border-t border-[#124B70]/10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-[10px] font-black text-[#124B70] uppercase tracking-[0.5em]">Crafted with Purity in India</div>
                <div className="text-[10px] font-black text-[#124B70]/60 uppercase tracking-[0.4em] text-center md:text-left">© {new Date().getFullYear()} Milgan Natural Alchemy. All rights reserved.</div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-[#124B70] rounded-full animate-pulse" />
                  <a href="https://weandyoumarketing.com" target="_blank" rel="noopener noreferrer" className="text-[9px] font-black text-[#124B70]/70 hover:text-[#124B70] uppercase tracking-[0.3em] transition-colors">
                    Developed and Maintained by WE&YOU
                  </a>
                </div>
              </div>
            </div>
          </footer>
          <div className="fixed bottom-0 left-0 right-0 flex justify-center pointer-events-none z-50">
            {/* Mobile View Signature */}
            <img
              src="/image/Milgan bottom mobile.png"
              alt="Milgan Sanctuary Signature Mobile"
              className="block sm:hidden w-full max-w-[60rem] h-auto object-contain select-none opacity-100"
              style={{ filter: "brightness(0) saturate(100%) invert(19%) sepia(21%) saturate(2377%) hue-rotate(193deg) brightness(93%) contrast(92%)" }}
            />
            {/* Desktop View Signature */}
            <img
              src="/image/Milgan bottom.png"
              alt="Milgan Sanctuary Signature"
              className="hidden sm:block w-full max-w-[60rem] sm:max-w-[60rem] md:max-w-[75rem] h-auto object-contain select-none opacity-100"
              style={{ filter: "brightness(0) saturate(100%) invert(19%) sepia(21%) saturate(2377%) hue-rotate(193deg) brightness(93%) contrast(92%)" }}
            />
          </div>
        </>
      )}
    </>
  );
}


