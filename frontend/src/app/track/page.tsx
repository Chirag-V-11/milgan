"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CustomerTrackingPage() {
  const [awb, setAwb] = useState('');
  const [loading, setLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [error, setError] = useState('');

  // Handle tracking query
  const handleTrack = async (searchAwb: string) => {
    if (!searchAwb.trim()) return;
    setLoading(true);
    setError('');
    setTrackingData(null);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBase}/api/shipping/orders`);
      
      const data = await response.json();
      if (response.ok && data.success) {
        const order = data.orders.find((o: any) => 
          o.id.toLowerCase() === searchAwb.trim().toLowerCase() || 
          (o.awbNumber && o.awbNumber.toLowerCase() === searchAwb.trim().toLowerCase())
        );

        if (order) {
          // Construct simulated tracking info based on the local order status
          const mockTimeline = {
            awbNumber: order.awbNumber || order.id,
            currentStatus: order.status === 'Shipped' ? 'In Transit' : order.status,
            history: order.status === 'Cancelled' ? [
              { status: 'Order Cancelled', location: 'Merchant Portal', timestamp: new Date().toISOString() }
            ] : order.status === 'Shipped' ? [
              { status: 'In Transit', location: 'Hub Facility', timestamp: new Date().toISOString() },
              { status: 'Booked', location: 'Origin Gateway', timestamp: new Date(Date.now() - 86400000).toISOString() }
            ] : [
              { status: 'Order Placed', location: 'Merchant Portal', timestamp: new Date().toISOString() }
            ]
          };
          setTrackingData(mockTimeline);
        } else {
          setError('No tracking information found for this ID/AWB.');
        }
      } else {
        setError(data.error || 'No tracking information found.');
      }
    } catch (err: any) {
      console.error('Tracking fetch error:', err);
      setError('Connection failed. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const awbParam = params.get('awb');
      if (awbParam) {
        setAwb(awbParam);
        handleTrack(awbParam);
      }
    }
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTrack(awb);
  };

  const loadExample = (exampleAwb: string) => {
    setAwb(exampleAwb);
    handleTrack(exampleAwb);
  };

  const getProgressIndex = (status: string) => {
    const s = status ? status.toLowerCase() : '';
    if (s.includes('delivered')) return 3;
    if (s.includes('out for delivery') || s.includes('outfordelivery')) return 2;
    if (s.includes('transit') || s.includes('dispatch') || s.includes('process') || s.includes('route')) return 1;
    return 0; // Booked
  };

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-72 px-6 md:px-12 lg:px-24 font-sans text-[#124B70] relative overflow-hidden flex flex-col items-center justify-start">
      {/* Premium Luxury Glowing Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#124B70]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#ffdb71]/15 rounded-full blur-3xl pointer-events-none" />
      
      <div className="w-full max-w-3xl relative z-10 space-y-10">
        
        {/* Navigation & Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-[#124B70]/10 pb-8">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-[9px] font-black text-[#124B70]/70 uppercase tracking-[0.4em]">Milgan Storefront Portal</span>
              <div className="h-px w-8 bg-[#124B70]/30" />
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#124B70] tracking-tight">
              Track Your <span className="text-[#124B70]/80 italic font-light">Gold</span>
            </h1>
          </div>
          <Link 
            href="/" 
            className="text-[9px] font-black uppercase tracking-widest border border-[#124B70]/10 text-[#124B70] px-6 py-2.5 rounded-full hover:bg-[#124B70] hover:text-white transition-all duration-300"
          >
            ← Return to Store
          </Link>
        </header>

        {/* Tracking Search Input Card */}
        <div className="bg-white/70 backdrop-blur-xl p-6 sm:p-10 rounded-[2.5rem] border border-[#124B70]/10 shadow-[0_20px_50px_rgba(18,75,112,0.06)] space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#124B70]">Shipment Tracking Hub</h2>
            <p className="text-xs text-[#124B70]/60 font-medium">Enter your Order ID or tracking reference to view transit milestones.</p>
          </div>

          <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              placeholder="e.g. MLG-2026-7712 or DTDC212403226"
              value={awb}
              onChange={(e) => setAwb(e.target.value)}
              className="flex-1 px-6 py-4 rounded-xl bg-white/80 border border-[#124B70]/15 focus:bg-white focus:border-[#124B70]/40 outline-none text-[#124B70] text-sm font-medium transition-all shadow-inner placeholder:text-[#124B70]/30"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-[#124B70] text-white font-black uppercase tracking-widest text-[10px] px-8 py-4 rounded-xl hover:bg-[#124B70]/90 transition-all duration-300 shadow-md disabled:opacity-50"
            >
              {loading ? 'Tracking...' : 'Locate Shipment'}
            </button>
          </form>

          {/* Quick Examples */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[10px] font-semibold text-[#124B70]/40">
            <span>Demo Numbers:</span>
            <button 
              onClick={() => loadExample('MLG-2026-7712')} 
              className="px-3 py-1 bg-[#124B70]/5 hover:bg-[#124B70]/15 hover:text-[#124B70] rounded-full border border-[#124B70]/10 transition-all duration-300 font-mono"
            >
              MLG-2026-7712
            </button>
            <button 
              onClick={() => loadExample('DTDC212403226')} 
              className="px-3 py-1 bg-[#124B70]/5 hover:bg-[#124B70]/15 hover:text-[#124B70] rounded-full border border-[#124B70]/10 transition-all duration-300 font-mono"
            >
              DTDC212403226
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-500 text-xs font-bold text-center animate-in fade-in zoom-in duration-300">
            ⚠️ {error}
          </div>
        )}

        {/* Tracking Details & Stepper */}
        {trackingData && (
          <div className="bg-white/70 backdrop-blur-xl p-6 sm:p-10 rounded-[2.5rem] border border-[#124B70]/10 shadow-[0_20px_50px_rgba(18,75,112,0.06)] space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#124B70]/10 pb-6">
              <div className="space-y-1">
                <div className="text-[9px] font-black text-[#124B70]/40 uppercase tracking-widest">Airway Bill (AWB)</div>
                <div className="text-xl font-mono font-bold text-[#124B70] tracking-wider">{trackingData.awbNumber}</div>
              </div>
              <div className="space-y-1 text-left sm:text-right">
                <div className="text-[9px] font-black text-[#124B70]/40 uppercase tracking-widest">Current Status</div>
                <span className="inline-block px-4 py-1 bg-[#124B70]/10 text-[#124B70] border border-[#124B70]/30 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {trackingData.currentStatus}
                </span>
              </div>
            </div>

            {/* Horizontal visual stepper lines */}
            <div className="bg-[#124B70]/5 p-5 rounded-2xl border border-[#124B70]/10 space-y-6">
              <div className="relative pt-4 pb-2">
                <div className="absolute top-[26px] left-[10%] right-[10%] h-[2px] bg-[#124B70]/10 z-0" />
                <div 
                  className="absolute top-[26px] left-[10%] h-[2px] bg-[#124B70] z-0 transition-all duration-500" 
                  style={{ width: `${getProgressIndex(trackingData.currentStatus) * 26.6}%` }}
                />
                
                <div className="flex justify-between relative z-10">
                  {['Booked', 'In Transit', 'Out For Delivery', 'Delivered'].map((label, idx) => {
                    const step = getProgressIndex(trackingData.currentStatus);
                    const isCompleted = idx <= step;
                    const isActive = idx === step;
                    
                    return (
                      <div key={idx} className="flex flex-col items-center space-y-2 w-16">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-[9px] font-black transition-all duration-300 ${
                          isCompleted 
                            ? 'bg-[#124B70] border-[#124B70] text-white shadow-md' 
                            : isActive 
                            ? 'bg-white border-[#124B70] text-[#124B70] animate-pulse' 
                            : 'bg-white border-[#124B70]/25 text-[#124B70]/40'
                        }`}>
                          {isCompleted ? '✓' : idx + 1}
                        </div>
                        <span className={`text-[7.5px] font-black uppercase tracking-wider text-center ${
                          isCompleted ? 'text-[#124B70]' : 'text-[#124B70]/40'
                        }`}>
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>



          </div>
        )}

      </div>
    </div>
  );
}
