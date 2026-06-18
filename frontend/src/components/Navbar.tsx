"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import UserAuthModal from './UserAuthModal';

const Navbar = () => {
  const { user, logout } = useUser();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 w-[92%] md:w-[100%] max-w-[70rem]`}>
        <div className={`
          relative flex items-center justify-between px-6 md:px-8 py-4 rounded-full border transition-all duration-700
          ${isScrolled
            ? 'bg-white/90 backdrop-blur-2xl border-[#124B70]/20 shadow-[0_10px_40px_rgba(18,75,112,0.1)] py-3'
            : 'bg-[#FCEFB4]/90 backdrop-blur-md border-[#124B70]/10 shadow-sm py-5'}
        `}>
          {/* Logo Sanctuary */}
          <Link href="/" className="flex items-center gap-3">
            <img src="/image/milgan logo-0.png" alt="Milgan" className="w-9 h-9 object-contain" style={{ filter: "brightness(0) saturate(100%) invert(19%) sepia(21%) saturate(2377%) hue-rotate(193deg) brightness(93%) contrast(92%)" }} />
            <div className="flex flex-col">
              <span className="text-lg font-serif font-bold text-[#124B70] tracking-tight leading-none drop-shadow-sm">Milgan</span>
              <span className="text-[7px] font-black uppercase tracking-[0.3em] text-[#124B70]/60 mt-1 leading-none">Natural Alchemy</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {['Products', 'Contact'].map((item) => (
              <Link
                key={item}
                href={item === 'Products' ? '/#boutique' : '/contact'}
                className="relative text-[10px] font-black uppercase tracking-[0.4em] text-[#124B70] hover:text-[#124B70] transition-all duration-300 py-2 group/link"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#124B70] transition-all duration-500 group-hover/link:w-full" />
              </Link>
            ))}
          </div>

          {/* User Portal & Hamburger */}
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden md:block">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#124B70]">Hello, {user.name.split(' ')[0]}</span>
                  <button onClick={logout} className="text-[9px] font-black uppercase tracking-[0.2em] text-[#124B70]/60 hover:text-red-500 transition-colors border border-[#124B70]/20 hover:border-red-500/30 px-4 py-2 rounded-xl">Logout</button>
                </div>
              ) : (
                <button onClick={() => setIsAuthModalOpen(true)} className="bg-gradient-to-r from-[#FDE047] to-[#FACC15] text-[#124B70] px-8 py-3.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] transition-all duration-500 shadow-md hover:shadow-[0_8px_30px_rgba(250,204,21,0.3)] hover:-translate-y-0.5 active:scale-[0.98] border border-white/50">Join Legacy</button>
              )}
            </div>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-full bg-[#124B70]/10 flex flex-col items-center justify-center gap-1 group overflow-hidden border border-[#124B70]/20"
            >
              <div className={`w-4 h-0.5 bg-[#124B70] transition-all duration-500 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <div className={`w-4 h-0.5 bg-[#124B70] transition-all duration-500 ${isMobileMenuOpen ? '-translate-x-10 opacity-0' : ''}`} />
              <div className={`w-4 h-0.5 bg-[#124B70] transition-all duration-500 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu Sanctuary */}
        <div className={`
          absolute top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-2xl rounded-[2.5rem] border border-[#124B70]/20 p-10 space-y-10 transition-all duration-700 md:hidden shadow-[0_20px_50px_rgba(18,75,112,0.1)]
          ${isMobileMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-10 invisible'}
        `}>
          <div className="flex flex-col gap-8 text-center">
            {['Products', 'Contact'].map((item) => (
              <Link
                key={item}
                href={item === 'Products' ? '/#boutique' : '/contact'}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[12px] font-black uppercase tracking-[0.6em] text-[#124B70]/70 hover:text-[#124B70] transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
          <div className="pt-10 border-t border-[#124B70]/10 flex flex-col items-center gap-6">
            {user ? (
              <>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#124B70]">Hi, {user.name}</span>
                <button onClick={logout} className="text-[10px] font-black uppercase tracking-widest text-red-500">Logout</button>
              </>
            ) : (
              <button onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }} className="w-full bg-gradient-to-r from-[#FDE047] to-[#FACC15] text-[#124B70] py-5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-md border border-white/50">Join Legacy</button>
            )}
          </div>
        </div>
      </nav>

      <UserAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Navbar;