"use client";
import React, { useState } from 'react';

const FloatingSocials = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  const socials = [
    {
      name: 'WhatsApp',
      url: 'https://wa.me/919999999999', // Placeholder number, easy for user to replace
      color: 'bg-[#25D366] text-white shadow-[0_8px_30px_rgba(37,211,102,0.2)] border border-transparent',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.48-.003 9.931-4.462 9.934-9.945.002-2.657-1.03-5.155-2.906-7.033A9.85 9.85 0 0 0 12.008 1.83C6.529 1.83 2.08 6.284 2.077 11.77c-.001 1.57.418 3.104 1.214 4.467l-.999 3.646 3.734-.979zM17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        </svg>
      )
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/milgan_foods?igsh=MW5qenFhOWtnenI3NA==', // Placeholder
      color: 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white shadow-[0_8px_30px_rgba(238,42,123,0.2)] border border-transparent',
      icon: (
        <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      )
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/share/1GZo5e9yab/', // Placeholder
      color: 'bg-[#1877F2] text-white shadow-[0_8px_30px_rgba(24,119,242,0.2)] border border-transparent',
      icon: (
        <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
        </svg>
      )
    }
  ];

  return (
    <div className="fixed right-6 bottom-6 z-[100] flex flex-col items-center">
      {/* Social Links Stack */}
      <div
        className={`absolute bottom-[4.5rem] flex flex-col gap-3 transition-all duration-500 ease-out ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {socials.map((social, idx) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              w-12 h-12 rounded-full flex items-center justify-center
              ${social.color} cursor-pointer active:scale-95 transition-all hover:scale-110 duration-300
            `}
            style={{
              transitionDelay: isOpen ? `${idx * 75}ms` : '0ms'
            }}
            aria-label={`Follow/Contact us on ${social.name}`}
          >
            {social.icon}
          </a>
        ))}
      </div>

      {/* Tooltip Capsule for First Open */}
      {showTooltip && !isOpen && (
        <div className="absolute right-[4.5rem] bottom-2.5 bg-[#124B70] text-[#FDFDFD] px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap shadow-[0_8px_25px_rgba(18,75,112,0.25)] border border-white/10 animate-in fade-in slide-in-from-right-4 duration-500 flex items-center gap-2 select-none">
          <span>Contact Us</span>
          <button 
            onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }}
            className="text-white/60 hover:text-white ml-1 font-bold text-xs cursor-pointer"
            title="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false);
        }}
        className="w-14 h-14 rounded-full flex items-center justify-center bg-[#124B70] text-[#FDFDFD] shadow-[0_10px_30px_rgba(18,75,112,0.35)] hover:shadow-[0_15px_35px_rgba(18,75,112,0.5)] cursor-pointer active:scale-95 hover:scale-105 transition-all duration-300 border border-white/10"
        aria-label="Contact Us"
      >
        {isOpen ? (
          <svg
            className="w-6 h-6 animate-in spin-in-90 duration-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg
            className="w-6 h-6 animate-in zoom-in-75 duration-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>
    </div>
  );
};

export default FloatingSocials;
