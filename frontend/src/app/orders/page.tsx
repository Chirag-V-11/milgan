"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { getApiUrl } from '@/config/api';

interface OrderItem {
  id: string;
  customerName: string;
  date?: string;
  items: string;
  total?: number;
  declaredValue?: number;
  paymentMethod?: string;
  status: 'Pending Booking' | 'Booked' | 'Shipped' | 'Delivered' | 'Cancelled';
  awbNumber?: string;
  imageUrl?: string;
  phone?: string;
  email?: string;
}

const PRODUCT_IMAGES: Record<string, string> = {
  ghee: '/image/image.webp',
  vedic: '/image/image.webp',
  cow: '/image/place_the_ghee_jar_2K_202605141500.webp',
  a2: '/image/place_the_ghee_jar_2K_202605141500.webp',
  default: '/image/image.webp'
};

function getProductImage(items: string): string {
  const lower = (items || '').toLowerCase();
  if (lower.includes('a2') || lower.includes('cow')) return PRODUCT_IMAGES.cow;
  return PRODUCT_IMAGES.default;
}

export default function CustomerOrdersPage() {
  const { user, loading: userLoading } = useUser();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (userLoading) return;
    
    if (user) {
      fetchUserOrders();
    } else {
      setLoadingOrders(false);
    }
  }, [user, userLoading]);

  const fetchUserOrders = async () => {
    if (!user) return;
    setLoadingOrders(true);
    try {
      const apiBase = getApiUrl();
      // Fetch orders filtered by user phone number
      const response = await fetch(`${apiBase}/api/shipping/orders?phone=${encodeURIComponent(user.phone)}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Sort orders to show the latest order at the top
        const sortedOrders = [...data.orders].sort((a: OrderItem, b: OrderItem) => {
          // If we have id strings, sort descending (e.g. numeric ID or string comparison)
          const aId = parseInt(a.id.replace(/\D/g, '')) || 0;
          const bId = parseInt(b.id.replace(/\D/g, '')) || 0;
          if (aId && bId) return bId - aId;
          // Fallback to order ID string comparison
          return b.id.localeCompare(a.id);
        });
        setOrders(sortedOrders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'Shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Pending Booking': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-transparent p-8 flex items-center justify-center font-sans text-[#124B70]">
        <div className="text-center font-serif italic text-lg animate-pulse">Entering the sanctuary...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-transparent p-4 sm:p-8 md:p-16 font-sans text-[#124B70] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#ffdb71]/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-md w-full bg-white/70 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] border border-[#124B70]/10 shadow-[0_20px_50px_rgba(18,75,112,0.06)] text-center space-y-6 relative z-10">
          <div className="text-5xl">🏺</div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#124B70]">Access Sanctuary</h2>
          <p className="text-xs text-[#124B70]/60 leading-relaxed">Please sign in to your Milgan Foods customer account to view your order history and live parcel logs.</p>
          <div className="pt-4">
            <Link 
              href="/" 
              className="inline-block bg-[#124B70] text-white font-black uppercase tracking-widest text-[10px] px-8 py-4 rounded-xl hover:bg-[#124B70]/90 transition-all duration-300 shadow-md"
            >
              Return Home to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-72 px-6 md:px-12 lg:px-24 font-sans text-[#124B70] relative overflow-hidden flex flex-col items-center justify-start">
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#124B70]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#ffdb71]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10 space-y-12">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-[#124B70]/10 pb-8">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-[9px] font-black text-[#124B70]/70 uppercase tracking-[0.4em]">Customer Account Vault</span>
              <div className="h-px w-8 bg-[#124B70]/30" />
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#124B70] tracking-tight">
              Your <span className="text-[#124B70]/80 italic font-light">Orders</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchUserOrders}
              className="text-[9px] font-black uppercase tracking-widest border border-[#124B70]/20 text-[#124B70] px-4 py-2.5 rounded-full hover:bg-[#124B70]/5 transition-all duration-300"
            >
              ↻ Refresh
            </button>
            <Link 
              href="/" 
              className="text-[9px] font-black uppercase tracking-widest border border-[#124B70]/10 text-[#124B70] px-6 py-2.5 rounded-full hover:bg-[#124B70] hover:text-white transition-all duration-300"
            >
              ← Return to Store
            </Link>
          </div>
        </header>

        {/* Content list */}
        <div className="space-y-6">
          {loadingOrders ? (
            <div className="text-center py-20 text-[#124B70]/30 font-serif italic text-lg animate-pulse">Retrieving order database...</div>
          ) : orders.length === 0 ? (
            <div className="bg-white/60 border border-[#124B70]/10 p-16 rounded-[2.5rem] text-center space-y-4">
              <div className="text-5xl opacity-30">📦</div>
              <p className="text-[#124B70]/40 font-serif italic">No curation orders found under your account ledger.</p>
              <p className="text-[9px] text-[#124B70]/30 font-semibold uppercase tracking-widest">Add items to your cart and press "Buy Now" to place your first order.</p>
            </div>
          ) : (
            orders.map((order) => {
              const awb = order.awbNumber || '';
              const productImage = order.imageUrl || getProductImage(order.items);
              const displayTotal = order.total || order.declaredValue || 0;

              return (
                <div 
                  key={order.id} 
                  className="bg-white/70 backdrop-blur-xl p-6 sm:p-8 rounded-[2.5rem] border border-[#124B70]/10 shadow-[0_20px_50px_rgba(18,75,112,0.06)] flex flex-col gap-6 hover:border-[#124B70]/30 transition-all duration-500"
                >
                  {/* Order Primary Row */}
                  <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6">
                    <div className="flex gap-4 sm:gap-6 items-center">
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl overflow-hidden bg-[#124B70]/5 border border-[#124B70]/10 shadow-inner flex-shrink-0">
                        <img 
                          src={productImage} 
                          alt={order.items} 
                          className="w-full h-full object-cover" 
                          onError={(e) => { e.currentTarget.src = '/image/image.webp'; }}
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-[#124B70] font-serif font-bold text-base sm:text-lg">{order.id}</span>
                          {order.date && <span className="text-[9px] font-black uppercase tracking-mono text-[#124B70]/40">{order.date}</span>}
                        </div>
                        <div className="text-xs text-[#124B70]/70 font-semibold">{order.items}</div>
                        <div className="flex flex-wrap gap-4 text-[10px] text-[#124B70]/50 font-semibold">
                          {displayTotal > 0 && <div>Total: <span className="text-[#124B70] font-bold">₹{displayTotal}</span></div>}
                          {order.paymentMethod && <div>Payment: <span className="text-[#124B70]/70">{order.paymentMethod}</span></div>}
                          {awb && <div>AWB: <span className="font-mono text-[#124B70]/60">{awb}</span></div>}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center items-end gap-1.5 pt-4 md:pt-0 border-t md:border-t-0 border-[#124B70]/5">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
