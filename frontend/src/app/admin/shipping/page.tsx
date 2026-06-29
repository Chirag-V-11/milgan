"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface MockOrder {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  pincode: string;
  city: string;
  state: string;
  items: string;
  declaredValue: number;
  status: 'Pending Booking' | 'Shipped' | 'Cancelled';
  awbNumber?: string;
}

export default function AdminShippingDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<MockOrder[]>([]);

  // Authenticate Admin Session & Fetch Orders
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    
    fetchOrders();

    // Auto-refresh orders every 10 seconds to show new Buy Now orders
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [router]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBase}/api/shipping/orders`);
      const data = await response.json();
      if (response.ok && data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: 'Pending Booking' | 'Shipped' | 'Cancelled') => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBase}/api/shipping/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        // Update local state
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating status');
    }
  };

  const handlePrint = (order: MockOrder) => {
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Shipment Details - ${order.id}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              color: #333;
              padding: 40px;
              margin: 0;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #124B70;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 28px;
              font-weight: 800;
              color: #124B70;
              letter-spacing: 2px;
              margin: 0;
            }
            .subtitle {
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 3px;
              color: #666;
              margin-top: 5px;
              font-weight: 600;
            }
            .details-grid {
              display: grid;
              grid-template-cols: 1fr 1fr;
              gap: 30px;
              margin-bottom: 40px;
            }
            .section-title {
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #888;
              margin-bottom: 8px;
              border-bottom: 1px solid #eee;
              padding-bottom: 4px;
              font-weight: 800;
            }
            .value {
              font-size: 13px;
              font-weight: bold;
              line-height: 1.6;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 40px;
            }
            .items-table th {
              background: #f8f9fa;
              font-size: 11px;
              text-transform: uppercase;
              padding: 12px 10px;
              text-align: left;
              border-bottom: 2px solid #dee2e6;
              font-weight: 800;
              color: #495057;
            }
            .items-table td {
              padding: 14px 10px;
              border-bottom: 1px solid #dee2e6;
              font-size: 13px;
            }
            .total-section {
              text-align: right;
              font-size: 16px;
              font-weight: bold;
              border-top: 2px solid #124B70;
              padding-top: 15px;
              color: #124B70;
            }
            .footer {
              margin-top: 60px;
              text-align: center;
              font-size: 10px;
              color: #aaa;
              border-top: 1px solid #eee;
              padding-top: 20px;
              line-height: 1.5;
            }
            @media print {
              body { padding: 10px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="logo">MILGAN</h1>
            <div class="subtitle">Natural Alchemy Shipment Details</div>
          </div>
          
          <div class="details-grid">
            <div>
              <div class="section-title">Shipment Info</div>
              <div class="value">Order ID: ${order.id}</div>
              <div class="value">Payment Method: WhatsApp</div>
              <div class="value">Status: ${order.status}</div>
            </div>
            <div>
              <div class="section-title">Delivery Address</div>
              <div class="value">${order.customerName}</div>
              <div class="value" style="font-weight: normal; font-size: 13px; color: #555;">
                ${order.address}<br>
                ${order.city}, ${order.state} - ${order.pincode}<br>
                Phone: ${order.phone}<br>
                Email: ${order.email || 'N/A'}
              </div>
            </div>
          </div>

          <div class="section-title" style="margin-bottom: 15px;">Consignment Details</div>
          <table class="items-table">
            <thead>
              <tr>
                <th>Items Ordered</th>
                <th style="text-align: right; width: 150px;">Declared Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight: 600; color: #212529;">${order.items}</td>
                <td style="text-align: right; font-weight: bold; color: #124B70;">₹${order.declaredValue}</td>
              </tr>
            </tbody>
          </table>

          <div class="total-section">
            Total Declared Value: ₹${order.declaredValue}
          </div>

          <div class="footer">
            Developed and Maintained by WE&YOU<br>
            © ${new Date().getFullYear()} Milgan Natural Alchemy. All rights reserved.
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#23212e] via-[#0A2637] to-[#041017] p-4 sm:p-8 md:p-12 font-sans text-gold relative overflow-hidden">
      {/* Premium Ambient glowing Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cream/[0.03] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-black text-cream uppercase tracking-[0.5em]">Sanctuary Administration</span>
              <div className="h-px w-12 bg-cream/30" />
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-gold tracking-tighter leading-tight">
              Shipping <span className="text-cream italic font-light">Hub</span>
            </h1>
            <p className="text-gold/40 text-xs sm:text-sm font-serif italic font-light">View customer logistics and orders status</p>
          </div>
          
          <div className="flex flex-wrap gap-2 items-center bg-white/[0.02] backdrop-blur-2xl p-2 border border-white/10 rounded-2xl">
            <Link href="/admin" className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest border border-white/10 px-6 py-2.5 rounded-xl hover:bg-gold hover:text-[#23212e] transition-all text-gold">Vault Products</Link>
            <Link href="/admin/users" className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest border border-white/10 px-6 py-2.5 rounded-xl hover:bg-gold hover:text-[#23212e] transition-all text-gold">Artisans</Link>
          </div>
        </header>

        {/* Dashboard table */}
        <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#244b82]/30 border-b border-cream/10 text-cream">
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Order ID / Customer</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Address</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Product Details</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream/5 text-sm">
                {orders.map((order) => {
                  return (
                    <tr key={order.id} className="hover:bg-[#244b82]/10 transition-colors group">
                      <td className="px-6 py-6">
                        <div className="text-white font-serif font-bold">{order.id}</div>
                        <div className="text-xs text-gold/80 mt-0.5">{order.customerName}</div>
                        <div className="text-[10px] font-mono text-white/30">{order.phone}</div>
                      </td>
                      <td className="px-6 py-6 text-xs text-white/60 font-medium max-w-xs">
                        <div>{order.address}</div>
                        <div className="text-[10px] text-white/40 mt-1 font-mono">{order.city}, {order.state} - {order.pincode}</div>
                      </td>
                      <td className="px-6 py-6 text-xs font-semibold text-white/80">
                        {order.items}
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col gap-1.5 items-start">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                            className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-xl border bg-transparent cursor-pointer focus:outline-none transition-all ${
                              order.status === 'Cancelled'
                                ? 'bg-red-950/20 text-red-400 border-red-500/30 hover:border-red-500/50'
                                : order.status === 'Shipped'
                                ? 'bg-green-950/20 text-green-400 border-green-500/30 hover:border-green-500/50'
                                : 'bg-white/5 text-white/70 border-white/10 hover:border-white/30'
                            }`}
                          >
                            <option value="Pending Booking" className="bg-[#23212e] text-white">Pending Booking</option>
                            <option value="Shipped" className="bg-[#23212e] text-green-400">Shipped</option>
                            <option value="Cancelled" className="bg-[#23212e] text-red-400">Cancelled</option>
                          </select>
                          <button
                            onClick={() => handlePrint(order)}
                            className="mt-2.5 text-[8px] font-black uppercase tracking-widest text-[#fdce47] hover:text-white border border-[#fdce47]/30 hover:border-white/40 px-3 py-1.5 rounded-lg transition-all"
                          >
                            Print Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
