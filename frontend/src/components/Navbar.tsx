"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { useCart } from '@/context/CartContext';
import UserAuthModal from './UserAuthModal';

const Navbar = () => {
  const { user, logout } = useUser();
  const { cartCount, setIsOpen } = useCart();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 w-[92%] md:w-[100%] max-w-[70rem]`}>
        <div className={`
          relative flex items-center justify-between px-6 md:px-8 py-4 rounded-full border transition-all duration-700
          ${isScrolled
            ? 'bg-white/90 backdrop-blur-2xl border-[#124B70]/20 shadow-[0_10px_40px_rgba(18,75,112,0.1)] py-3'
            : 'bg-[#ffdb71]/90 backdrop-blur-md border-[#124B70]/10 shadow-sm py-5'}
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
            
            {/* Cart Toggle Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2.5 rounded-full bg-[#124B70]/10 hover:bg-[#124B70]/20 text-[#124B70] transition-all duration-300 border border-[#124B70]/10"
              title="View Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1,0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0,1-1.12-1.243l1.264-12A1.125 1.125 0 0,1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1,1-.75 0 .375.375 0 0,1 .75 0Zm7.5 0a.375.375 0 1,1-.75 0 .375.375 0 0,1 .75 0Z" />
              </svg>
              {cartCount > 0 && (
                <span key={cartCount} className="absolute -top-1 -right-1 bg-gold text-[#23212e] text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-[#124B70]/10 shadow-[0_2px_8px_rgba(252,196,51,0.4)] font-sans animate-pop">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="hidden md:block" ref={dropdownRef}>
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-[#124B70] hover:opacity-80 transition-opacity focus:outline-none"
                  >
                    <span>Hello, {user.name.split(' ')[0]}</span>
                    <svg className={`w-3 h-3 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3.5 w-44 bg-white/95 backdrop-blur-2xl border border-[#124B70]/15 rounded-2xl shadow-xl py-2 z-[110] animate-in fade-in slide-in-from-top-2 duration-200">
                      <Link 
                        href="/orders" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-[10px] font-black uppercase tracking-wider text-[#124B70] hover:bg-[#124B70]/5 transition-colors"
                      >
                        <svg className="w-4 h-4 text-[#124B70]/70" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1,0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0,1-1.12-1.243l1.264-12A1.125 1.125 0 0,1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1,1-.75 0 .375.375 0 0,1 .75 0Zm7.5 0a.375.375 0 1,1-.75 0 .375.375 0 0,1 .75 0Z" />
                        </svg>
                        Your Orders
                      </Link>
                      <button 
                        onClick={() => { logout(); setIsDropdownOpen(false); }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-3 text-[10px] font-black uppercase tracking-wider text-red-500 hover:bg-red-500/5 transition-colors border-t border-[#124B70]/5"
                      >
                        <svg className="w-4 h-4 text-red-500/80" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0,0 13.5 3h-6a2.25 2.25 0 0,0-2.25 2.25v13.5A2.25 2.25 0 0,0 7.5 21h6a2.25 2.25 0 0,0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => setIsAuthModalOpen(true)} className="bg-gradient-to-r from-[#ffdb71] to-[#fdce47] text-[#124B70] px-8 py-3.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] transition-all duration-500 shadow-md hover:shadow-[0_8px_30px_rgba(253,206,71,0.3)] hover:-translate-y-0.5 active:scale-[0.98] border border-white/50">Join Legacy</button>
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
          <div className="pt-10 border-t border-[#124B70]/10 flex flex-col items-center gap-6 w-full">
            {user ? (
              <div className="flex flex-col items-center gap-4 w-full">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#124B70]/60">Hi, {user.name}</span>
                
                <div className="w-full flex flex-col items-center bg-[#124B70]/5 rounded-2xl py-2 space-y-2">
                  <Link 
                    href="/orders" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[10px] font-black uppercase tracking-[0.25em] text-[#124B70] py-2 w-full text-center hover:bg-[#124B70]/5 rounded-xl transition-colors"
                  >
                    Your Orders
                  </Link>
                  <button 
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500 py-2 border-t border-[#124B70]/10 w-3/4 text-center hover:bg-red-500/5 rounded-xl transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }} className="w-full bg-gradient-to-r from-[#ffdb71] to-[#fdce47] text-[#124B70] py-5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-md border border-white/50">Join Legacy</button>
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