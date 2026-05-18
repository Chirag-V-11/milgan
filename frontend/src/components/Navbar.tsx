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
      <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 w-[95%] max-w-5xl`}>
        <div className={`
          relative flex items-center justify-between px-6 md:px-8 py-4 rounded-full border transition-all duration-700
          ${isScrolled 
            ? 'bg-white/70 backdrop-blur-2xl border-forest/5 shadow-[0_20px_50px_rgba(27,67,50,0.1)] py-3' 
            : 'bg-[#FDFBF7]/30 backdrop-blur-sm border-transparent py-5'}
        `}>
          {/* Logo Sanctuary */}
          <Link href="/" className="group flex items-center gap-2 md:gap-3">
             <div className="w-8 h-8 bg-forest rounded-full flex items-center justify-center text-white text-[10px] font-black group-hover:bg-gold transition-colors duration-500">M</div>
             <span className="text-lg md:text-xl font-serif font-black text-forest tracking-tighter transition-colors group-hover:text-gold">Milgan</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {['Boutique', 'Legacy', 'Purity'].map((item) => (
              <Link 
                key={item} 
                href={item === 'Boutique' ? '/#boutique' : '/contact'} 
                className="text-[10px] font-black uppercase tracking-[0.4em] text-forest/40 hover:text-gold transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* User Portal & Hamburger */}
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden md:block">
               {user ? (
                 <div className="flex items-center gap-4">
                   <span className="text-[10px] font-black uppercase tracking-widest text-gold animate-pulse">Hello, {user.name.split(' ')[0]}</span>
                   <button onClick={logout} className="text-[10px] font-black uppercase tracking-widest text-forest/20 hover:text-red-400 transition-colors">Logout</button>
                 </div>
               ) : (
                 <button onClick={() => setIsAuthModalOpen(true)} className="bg-forest text-white px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.3em] hover:bg-gold transition-all">Join Legacy</button>
               )}
            </div>

            {/* Mobile Hamburger Menu */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-full bg-forest flex flex-col items-center justify-center gap-1 group overflow-hidden"
            >
               <div className={`w-4 h-0.5 bg-white transition-all duration-500 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
               <div className={`w-4 h-0.5 bg-white transition-all duration-500 ${isMobileMenuOpen ? '-translate-x-10 opacity-0' : ''}`} />
               <div className={`w-4 h-0.5 bg-white transition-all duration-500 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu Sanctuary */}
        <div className={`
          absolute top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-2xl rounded-[2.5rem] border border-forest/5 p-10 space-y-10 transition-all duration-700 md:hidden
          ${isMobileMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-10 invisible'}
        `}>
           <div className="flex flex-col gap-8 text-center">
              {['Boutique', 'Legacy', 'Purity'].map((item) => (
                <Link 
                  key={item} 
                  href={item === 'Boutique' ? '/#boutique' : '/contact'} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[12px] font-black uppercase tracking-[0.6em] text-forest/40 hover:text-gold transition-colors"
                >
                  {item}
                </Link>
              ))}
           </div>
           <div className="pt-10 border-t border-forest/5 flex flex-col items-center gap-6">
              {user ? (
                <>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gold">Hi, {user.name}</span>
                  <button onClick={logout} className="text-[10px] font-black uppercase tracking-widest text-red-400">Logout</button>
                </>
              ) : (
                <button onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }} className="w-full bg-forest text-white py-5 rounded-full text-[10px] font-black uppercase tracking-[0.4em]">Join Legacy</button>
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
