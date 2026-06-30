"use client";
import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import UserAuthModal from '@/components/UserAuthModal';
import { getApiUrl } from '@/config/api';

export default function ContactPage() {
  const { user } = useUser();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [inquiry, setInquiry] = useState('');
  const [sent, setSent] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setContact(user.email || user.phone || '');
    } else {
      setName('');
      setContact('');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!name || !contact || !inquiry) {
      return;
    }

    try {
      setSent(true);

      const apiBase = getApiUrl();
      const response = await fetch(`${apiBase}/api/inquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          contact: contact,
          inquiry: inquiry,
          userEmail: user?.email || contact
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setName('');
        setContact('');
        setInquiry('');
        alert('Your inquiry was successfully sent directly to mail!');
      } else {
        alert(data.error || 'Failed to send inquiry. Please try again later.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to send inquiry. Please check your network connection.');
    } finally {
      setSent(false);
    }
  };

  return (
    <div className="min-h-screen py-24 px-6 md:px-12 lg:px-24 bg-transparent font-sans selection:bg-[#124B70]/10 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#124B70]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
        {/* Story Section */}
        <div className="space-y-12">
          <div className="space-y-6">
            <span className="text-[#124B70]/70 font-black text-[10px] uppercase tracking-[0.4em] block">Inquire with Purity</span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-[#124B70] leading-[0.95] tracking-tighter">
              Get in <span className="text-[#124B70]/80 italic font-light">Touch</span>
            </h1>
            <p className="text-[#124B70]/80 text-base md:text-lg font-serif italic leading-relaxed max-w-lg">
              Whether you are looking for the finest Bilona Ghee or seeking a bespoke collaboration, our concierge is here to assist you in your journey towards purity.
            </p>
          </div>

          <div className="space-y-8 pt-8 border-t border-[#124B70]/10">
            <div>
              <h3 className="text-[10px] font-black text-[#124B70]/40 uppercase tracking-[0.2em] mb-3">Our Sanctuaries</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[#124B70]/70 font-black text-[9px] uppercase tracking-widest mb-1.5">Southern Sanctuary</p>
                  <p className="text-[#124B70]/90 font-serif text-base md:text-lg italic leading-relaxed">
                    NO-5, RAMANNA LAYOUT, GANGASANDRA MAIN ROAD,<br />
                    MARALUR, TUMKUR TALUK,<br />
                    Tumkur, Karnataka - 572105
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-[10px] font-black text-[#124B70]/40 uppercase tracking-[0.2em] mb-2">Direct Liaison</h3>
              <p className="text-[#124B70] font-serif text-xl italic font-semibold">+91 86600 13411</p>
              <p className="text-[#124B70] font-serif text-xl italic font-semibold">info@milganfoods.com</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-[#124B70]/5 blur-3xl rounded-full animate-pulse duration-[8s]" />
          <div className="relative bg-white/70 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(18,75,112,0.06)] border border-[#124B70]/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-[#124B70]/70 uppercase tracking-widest ml-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Mr. Chirag V"
                  className="w-full bg-white/80 px-5 py-3.5 rounded-2xl border border-[#124B70]/15 focus:bg-white focus:border-[#124B70]/40 outline-none transition-all text-[#124B70] placeholder:text-[#124B70]/30 shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-[#124B70]/70 uppercase tracking-widest ml-1">Communication Channel (Email/Phone)</label>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="How shall we reach you?"
                  className="w-full bg-white/80 px-5 py-3.5 rounded-2xl border border-[#124B70]/15 focus:bg-white focus:border-[#124B70]/40 outline-none transition-all text-[#124B70] placeholder:text-[#124B70]/30 shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-[#124B70]/70 uppercase tracking-widest ml-1">Your Inquiry</label>
                <textarea
                  rows={4}
                  required
                  value={inquiry}
                  onChange={(e) => setInquiry(e.target.value)}
                  placeholder="Tell us about your requirements..."
                  className="w-full bg-white/80 px-5 py-3.5 rounded-2xl border border-[#124B70]/15 focus:bg-white focus:border-[#124B70]/40 outline-none transition-all resize-none text-[#124B70] placeholder:text-[#124B70]/30 shadow-sm"
                />
              </div>
              <button
                type="submit"
                className={`w-full py-4.5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all active:scale-95 ${sent ? 'bg-[#124B70]/50 text-white cursor-wait' : 'bg-[#124B70] text-[#FDFDFD] hover:bg-[#124B70]/90 hover:shadow-lg hover:shadow-[#124B70]/10'}`}
              >
                {sent ? '✓ Sending...' : 'Send Inquiry'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <UserAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticated={() => {}}
      />
    </div>
  );
}
