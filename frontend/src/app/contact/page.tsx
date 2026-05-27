"use client";
import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import UserAuthModal from '@/components/UserAuthModal';

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

      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
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
              <h3 className="text-[10px] font-black text-forest/30 uppercase tracking-[0.2em] mb-2">Our Sanctuaries</h3>
              <div className="space-y-4">

                <div>
                  <p className="text-gold font-bold text-[9px] uppercase tracking-widest mb-1">Southern Sanctuary</p>
                  <p className="text-forest font-serif text-lg italic leading-relaxed">
                    NO-5, RAMANNA LAYOUT, GANGASANDRA MAIN ROAD,<br />
                    MARALUR, TUMKUR TALUK,<br />
                    Tumkur, Karnataka - 572105
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-[10px] font-black text-forest/30 uppercase tracking-[0.2em] mb-2">Direct Liaison</h3>
              <p className="text-forest font-serif text-xl italic">+91 86600 13411</p>
              <p className="text-forest font-serif text-xl italic">info@milganfoods.com</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-full" />
          <div className="relative bg-white p-12 rounded-[3rem] shadow-[0_30px_100px_rgba(27,67,50,0.08)] border border-gold/10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-forest/40 uppercase tracking-widest ml-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Mr. Chirag V"
                  className="w-full bg-cream/30 px-6 py-4 rounded-2xl border border-transparent focus:bg-white focus:border-gold/30 outline-none transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-forest/40 uppercase tracking-widest ml-1">Communication Channel (Email/Phone)</label>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="how shall we reach you?"
                  className="w-full bg-cream/30 px-6 py-4 rounded-2xl border border-transparent focus:bg-white focus:border-gold/30 outline-none transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-forest/40 uppercase tracking-widest ml-1">Your Inquiry</label>
                <textarea
                  rows={4}
                  required
                  value={inquiry}
                  onChange={(e) => setInquiry(e.target.value)}
                  placeholder="Tell us about your requirements..."
                  className="w-full bg-cream/30 px-6 py-4 rounded-2xl border border-transparent focus:bg-white focus:border-gold/30 outline-none transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                className={`w-full py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[12px] transition-all shadow-xl active:scale-95 ${sent ? 'bg-cream text-forest shadow-cream/20' : 'bg-forest text-white hover:bg-cream hover:text-forest shadow-forest/10'}`}
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
