"use client";
import React from 'react';

export default function ContactPage() {
  return (
    <div className="min-h-screen py-20 px-8 md:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Story Section */}
        <div className="space-y-12">
          <div className="space-y-6">
            <span className="text-gold font-bold text-[10px] uppercase tracking-[0.4em] block">Inquire with Purity</span>
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-forest leading-[0.9] tracking-tighter">
              Get in <span className="text-gold italic">Touch</span>
            </h1>
            <p className="text-forest/60 text-lg md:text-xl font-medium leading-relaxed max-w-lg">
              Whether you are looking for the finest A2 Bilona Ghee or seeking a bespoke collaboration, our concierge is here to assist you in your journey towards purity.
            </p>
          </div>

          <div className="space-y-8 pt-8 border-t border-forest/10">
            <div>
              <h3 className="text-[10px] font-black text-forest/30 uppercase tracking-[0.2em] mb-2">Our Sanctuary</h3>
              <p className="text-forest font-serif text-xl italic">Indore, Madhya Pradesh, India</p>
            </div>
            <div>
              <h3 className="text-[10px] font-black text-forest/30 uppercase tracking-[0.2em] mb-2">Direct Liaison</h3>
              <p className="text-forest font-serif text-xl italic">+91 999 000 1111</p>
              <p className="text-forest font-serif text-xl italic">concierge@puregee.com</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-full" />
          <div className="relative bg-white p-12 rounded-[3rem] shadow-[0_30px_100px_rgba(27,67,50,0.08)] border border-gold/10">
            <form className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-forest/40 uppercase tracking-widest ml-1">Your Full Name</label>
                <input 
                  type="text" 
                  placeholder="Mr. Chirag V"
                  className="w-full bg-cream/30 px-6 py-4 rounded-2xl border border-transparent focus:bg-white focus:border-gold/30 outline-none transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-forest/40 uppercase tracking-widest ml-1">Communication Channel (Email/Phone)</label>
                <input 
                  type="text" 
                  placeholder="how shall we reach you?"
                  className="w-full bg-cream/30 px-6 py-4 rounded-2xl border border-transparent focus:bg-white focus:border-gold/30 outline-none transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-forest/40 uppercase tracking-widest ml-1">Your Inquiry</label>
                <textarea 
                  rows={4}
                  placeholder="Tell us about your requirements..."
                  className="w-full bg-cream/30 px-6 py-4 rounded-2xl border border-transparent focus:bg-white focus:border-gold/30 outline-none transition-all resize-none"
                />
              </div>
              <button className="w-full bg-forest text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[12px] hover:bg-gold transition-all shadow-xl shadow-forest/10 active:scale-95">
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
