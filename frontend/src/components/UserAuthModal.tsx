"use client";
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useUser } from '@/context/UserContext';

export default function UserAuthModal({ isOpen, onClose, onAuthenticated }: {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated?: () => void;
}) {
  const { login } = useUser();
  const [loading, setLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true); // Default to Login for better UX
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    password: '' // New Password Field
  });

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://milgan-backend.onrender.com';
      const url = isLoginMode
        ? `${apiBase}/api/users/login` // New dedicated login endpoint
        : `${apiBase}/api/users/profile`;

      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isLoginMode ? { phone: formData.phone, password: formData.password } : formData)
      };

      const response = await fetch(url, options);
      const data = await response.json();

      if (response.ok) {
        login(data);
        if (onAuthenticated) onAuthenticated();
        onClose();
      } else {
        alert(data.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (error) {
      alert('Connection failed. Please check your boutique server.');
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 w-screen h-screen z-[99999] grid place-items-center p-6 bg-[#23212e]/95 backdrop-blur-xl transition-all duration-500 overflow-y-auto font-sans">
      <div className="fixed inset-0 cursor-pointer" onClick={onClose} />

      <div className="relative bg-[#23212e] w-full max-w-2xl rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.6),0_0_80px_rgba(252,196,51,0.15)] overflow-hidden transition-all duration-700 flex flex-col md:flex-row border border-white/10 animate-in zoom-in-95 duration-500">

        {/* Decorative Side Narrative */}
        <div className="md:w-1/3 bg-[#244b82] p-10 text-white flex flex-col justify-between relative overflow-hidden border-r border-white/10">
          <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[url('https://images.unsplash.com/photo-1582233228805-72861066532d?auto=format&fit=crop&q=80&w=1000')] bg-cover" />
          <div className="relative z-10 space-y-4">
            <div className="text-5xl animate-bounce-slow">🏺</div>
            <h2 className="text-2xl font-serif font-bold leading-tight tracking-tight">
              {isLoginMode ? 'Welcome Back.' : 'The Artisan Register.'}
            </h2>
            <div className="h-px w-12 bg-white/20" />
          </div>
          <div className="relative z-10">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gold">Secure Portal</p>
          </div>
        </div>

        {/* Dynamic Form Side */}
        <div className="md:w-2/3 p-10 lg:p-12 space-y-8">
          <div className="space-y-1">
            <h3 className="text-2xl font-serif font-bold text-foreground">
              {isLoginMode ? 'Sign In' : 'Join the Legacy'}
            </h3>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground/40">
              {isLoginMode ? 'Enter your credentials' : 'Begin your journey with the purest ghee'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">

              {!isLoginMode && (
                <div className="space-y-1 group">
                  <label className="text-[9px] font-black text-foreground/40 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-gold">Full Name</label>
                  <input
                    required type="text" placeholder="John Doe"
                    className="w-full px-0 py-2 bg-transparent border-b border-white/10 focus:border-gold outline-none transition-all text-sm font-medium text-foreground placeholder:text-foreground/20"
                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              )}

              <div className={`grid ${isLoginMode ? 'grid-cols-1' : 'grid-cols-2'} gap-6`}>
                <div className="space-y-1 group">
                  <label className="text-[9px] font-black text-foreground/40 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-gold">Phone Number</label>
                  <input
                    required type="tel" placeholder="+91 ..."
                    className="w-full px-0 py-2 bg-transparent border-b border-white/10 focus:border-gold outline-none transition-all text-sm font-medium text-foreground placeholder:text-foreground/20"
                    value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                {!isLoginMode && (
                  <div className="space-y-1 group">
                    <label className="text-[9px] font-black text-foreground/40 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-gold">Email Address</label>
                    <input
                      required type="email" placeholder="john@example.com"
                      className="w-full px-0 py-2 bg-transparent border-b border-white/10 focus:border-gold outline-none transition-all text-sm font-medium text-foreground placeholder:text-foreground/20"
                      value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                )}
              </div>

              {/* Password Field - Always Visible */}
              <div className="space-y-1 group">
                <label className="text-[9px] font-black text-foreground/40 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-gold">Password</label>
                <input
                  required type="password" placeholder="••••••••"
                  className="w-full px-0 py-2 bg-transparent border-b border-white/10 focus:border-gold outline-none transition-all text-sm font-medium text-foreground placeholder:text-foreground/20"
                  value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              {!isLoginMode && (
                <div className="space-y-1 group">
                  <label className="text-[9px] font-black text-foreground/40 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-gold">Delivery Sanctuary (Address)</label>
                  <textarea
                    required rows={2} placeholder="House No, Street, City, State, PIN"
                    className="w-full px-0 py-2 bg-transparent border-b border-white/10 focus:border-gold outline-none transition-all text-sm font-medium resize-none text-foreground placeholder:text-foreground/20"
                    value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              )}
            </div>

            <div className="space-y-5 pt-2">
              <button
                type="submit" disabled={loading}
                className="w-full bg-gold text-[#23212e] py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[9px] shadow-2xl hover:bg-[#e1ddde] hover:text-[#23212e] transition-all disabled:opacity-50 border border-transparent"
              >
                {loading ? 'Authenticating...' : (isLoginMode ? 'Access My Legacy' : 'Confirm & Join')}
              </button>

              <div className="flex justify-between items-center px-1">
                <button
                  type="button"
                  onClick={() => setIsLoginMode(!isLoginMode)}
                  className="text-[8px] font-black uppercase tracking-widest text-foreground/50 hover:text-gold transition-colors"
                >
                  {isLoginMode ? "New? Register" : "Returning Artisan?"}
                </button>
                <button type="button" onClick={onClose} className="text-[8px] font-black uppercase tracking-widest text-foreground/50 hover:text-gold transition-colors">
                  Close
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
}
