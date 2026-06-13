"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://milgan-backend.onrender.com';
      const response = await fetch(`${apiBase}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('adminToken', data.token);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#23212e] via-[#0A2637] to-[#041017] flex items-center justify-center p-4 font-sans selection:bg-cream/30 relative overflow-hidden text-gold">
      {/* Premium Dark Amber Glowing Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cream/[0.03] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-md w-full bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden border border-white/5 relative z-10">
        <div className="bg-white/[0.02] p-10 text-gold text-center relative overflow-hidden border-b border-white/5">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" /></svg>
          </div>
          <h1 className="text-4xl font-serif font-bold tracking-tight mb-2">Admin <span className="text-cream italic">Vault</span></h1>
          <p className="text-gold/50 text-xs font-bold uppercase tracking-[0.2em]">Authorized Access Only</p>
        </div>

        <form onSubmit={handleLogin} className="p-10 space-y-8">
          {error && (
            <div className="p-4 bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl animate-in fade-in slide-in-from-top-1">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-3">
            <label className="block text-[10px] font-black text-gold/40 uppercase tracking-[0.2em] ml-1">Master Identity</label>
            <input
              type="email"
              required
              className="w-full px-6 py-4 rounded-2xl bg-black/40 border border-white/10 focus:bg-[#061C2C] focus:border-cream focus:ring-4 focus:ring-cream/5 outline-none transition-all font-medium text-gold placeholder:text-gold/20"
              placeholder="email@luxuryghee.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] font-black text-gold/40 uppercase tracking-[0.2em] ml-1">Access Cipher</label>
            <input
              type="password"
              required
              className="w-full px-6 py-4 rounded-2xl bg-black/40 border border-white/10 focus:bg-[#061C2C] focus:border-cream focus:ring-4 focus:ring-cream/5 outline-none transition-all font-medium text-gold placeholder:text-gold/20"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#fcc433] hover:bg-[#e68900] text-[#23212e] py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs shadow-2xl transition-all transform active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Decrypting...' : 'Enter Dashboard'}
          </button>

          <div className="text-center pt-4">
            <Link href="/" className="text-gold/30 text-[10px] font-black uppercase tracking-widest hover:text-cream transition-colors">
              ← Return to Main Store
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
