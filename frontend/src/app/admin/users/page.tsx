"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://milgan-backend.onrender.com';
      const response = await fetch(`${apiBase}/api/users/all`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error("Artisan fetch failed:", data.error);
        setUsers([]); // Reset to empty array on error
      }
    } catch (error) {
      console.error("Failed to fetch artisans:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchUsers();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest via-[#0A2637] to-[#041017] p-4 md:p-12 font-sans selection:bg-cream/30 text-gold relative overflow-hidden">
      {/* Premium Dark Amber Glowing Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cream/[0.03] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-forest/[0.03] rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <div className="space-y-1">
            <h1 className="text-5xl font-serif font-bold text-gold tracking-tighter">Artisan <span className="text-cream italic">Ledger</span></h1>
            <p className="text-gold/40 font-medium uppercase tracking-[0.2em] text-[10px] font-black">Managing your golden community</p>
          </div>
          <div className="flex gap-4">
            <Link href="/admin" className="text-[10px] font-black uppercase tracking-widest border border-gold/10 px-8 py-3 rounded-full hover:bg-gold hover:text-forest transition-all text-gold">Back to Vault</Link>
          </div>
        </header>

        <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-forest/30 border-b border-cream/10 text-cream">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Name</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Contact Details</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Delivery Sanctuary</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream/5">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-gold/20 font-serif italic text-lg animate-pulse">Consulting the ledger...</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-gold/20 font-serif italic text-lg">No artisans have joined the legacy yet.</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-forest/20 transition-colors group">
                      <td className="px-8 py-8">
                        <div className="text-gold font-serif font-bold text-lg">{user.name}</div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-cream opacity-0 group-hover:opacity-100 transition-opacity">Member since 2024</div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="text-gold font-medium text-sm">{user.phone}</div>
                        <div className="text-gold/40 text-xs">{user.email}</div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="text-gold/60 text-xs font-medium max-w-xs leading-relaxed">
                          {user.address}
                        </div>
                      </td>
                      <td className="px-8 py-8 text-right">
                        <div className="text-[10px] font-black uppercase tracking-widest text-gold/30">
                          {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
