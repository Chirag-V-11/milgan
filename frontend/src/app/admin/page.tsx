"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import supabase from '../../config/supabase';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const initialProductState = {
    name: '',
    description: '',
    image_url: '',
    image_urls: [''],
    amazon_url: '',
    blinkit_url: '',
    quantity_options: [
      { size: '1L', baseCost: 0, discountPercentage: 0, stockAvailable: 10 }
    ]
  };

  const [product, setProduct] = useState(initialProductState);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://milgan-backend.onrender.com';
      const response = await fetch(`${apiBase}/api/products?t=${Date.now()}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin/login');
        return;
      }
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://milgan-backend.onrender.com';
        const response = await fetch(`${apiBase}/api/auth/verify`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          throw new Error('Invalid token');
        }
        fetchProducts();
      } catch (err) {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
      }
    };
    verifyToken();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  // Image Handlers
  const handleAddImage = () => {
    setProduct({ ...product, image_urls: [...product.image_urls, ''] });
  };

  const handleImageChange = (index: number, value: string) => {
    const newUrls = [...product.image_urls];
    newUrls[index] = value;
    setProduct({ ...product, image_urls: newUrls });
  };

  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (index: number, file: File) => {
    if (!file) return;
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { contentType: file.type, upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(filePath);
      const newUrls = [...product.image_urls];
      newUrls[index] = publicUrl;
      setProduct({ ...product, image_urls: newUrls });
    } catch (error: any) {
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newUrls = product.image_urls.filter((_, i) => i !== index);
    setProduct({ ...product, image_urls: newUrls });
  };

  // Option Handlers
  const handleAddOption = () => {
    setProduct({
      ...product,
      quantity_options: [...product.quantity_options, { size: '', baseCost: 0, discountPercentage: 0, stockAvailable: 0 }]
    });
  };

  const handleOptionChange = (index: number, field: string, value: any) => {
    const newOptions = [...product.quantity_options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setProduct({ ...product, quantity_options: newOptions });
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = product.quantity_options.filter((_, i) => i !== index);
    setProduct({ ...product, quantity_options: newOptions });
  };

  // Edit Logic
  const startEditing = (p: any) => {
    console.log('[Editing Masterpiece]', p.name, p.id);
    setEditingId(p.id);
    const safeQuantityOptions = (p.quantity_options || []).map((opt: any) => ({
      size: opt.size || '',
      baseCost: opt.baseCost !== undefined ? opt.baseCost : (opt.price || 0),
      discountPercentage: opt.discountPercentage || 0,
      stockAvailable: opt.stockAvailable || 10
    }));

    setProduct({
      name: p.name || '',
      description: p.description || '',
      image_url: p.image_url || '',
      image_urls: p.image_urls && p.image_urls.length > 0 ? p.image_urls : [p.image_url || ''],
      amazon_url: p.amazon_url || '',
      blinkit_url: p.blinkit_url || '',
      quantity_options: safeQuantityOptions
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setProduct(initialProductState);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this masterpiece from the vault?")) return;
    const token = localStorage.getItem('adminToken');
    if (!token) {
      alert("Your session has expired. Please log in again to manage the collection.");
      router.push('/admin/login');
      return;
    }
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://milgan-backend.onrender.com';
      const response = await fetch(`${apiBase}/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Product removed successfully.' });
        fetchProducts();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete.' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    const token = localStorage.getItem('adminToken');
    if (!token) {
      alert("Authorization required. Redirecting to login...");
      router.push('/admin/login');
      return;
    }

    try {
      const apiBase2 = process.env.NEXT_PUBLIC_API_URL || 'https://milgan-backend.onrender.com';
      const url = editingId
        ? `${apiBase2}/api/products/${editingId}`
        : `${apiBase2}/api/products`;

      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...product, image_url: product.image_urls[0] }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: editingId ? 'Masterpiece refined successfully!' : 'New masterpiece published!' });
        setProduct(initialProductState);
        setEditingId(null);
        fetchProducts();
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Operation failed.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Connection error.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#23212e] via-[#0A2637] to-[#041017] p-4 sm:p-8 md:p-16 font-sans selection:bg-cream/30 relative overflow-hidden text-gold">
      {/* Premium Dark Amber Glowing Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cream/[0.03] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Dynamic Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 sm:mb-16 gap-6">
          <div className="space-y-2 w-full lg:w-auto">
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-black text-cream uppercase tracking-[0.5em]">Sanctuary Administration</span>
              <div className="h-px w-12 bg-cream/30" />
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-gold tracking-tighter leading-tight">
              Admin <span className="text-cream italic font-light">Control</span>
            </h1>
            <p className="text-gold/40 text-xs sm:text-sm font-serif italic font-light">Manage your golden legacy and curated natural treasures</p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4 items-center bg-white/[0.02] backdrop-blur-2xl p-2 sm:p-3 border border-white/10 rounded-2xl sm:rounded-[2rem] shadow-2xl w-full lg:w-auto justify-center lg:justify-start">
            <Link href="/admin/users" className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] border border-white/10 px-4 sm:px-7 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-gold hover:bg-gold hover:text-[#23212e] transition-all flex-1 sm:flex-initial text-center">Users</Link>
            <Link href="/" className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] border border-white/10 px-4 sm:px-7 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-gold hover:bg-gold hover:text-[#23212e] transition-all flex-1 sm:flex-initial text-center">Visit Website</Link>
            <button onClick={handleLogout} className="bg-red-950/20 hover:bg-red-900/40 border border-red-500/20 text-red-300 px-4 sm:px-7 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-[8px] sm:text-[9px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all flex-1 sm:flex-initial text-center">Logout</button>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 sm:gap-16">

          {/* Form Section */}
          <div className="xl:col-span-7 space-y-8">
            <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[2rem] sm:rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden">
              <div className="bg-gradient-to-r from-[#244b82]/40 to-[#244b82]/10 p-5 sm:p-10 text-gold flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden border-b border-white/5 backdrop-blur-md">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1582233228805-72861066532d?auto=format&fit=crop&q=80&w=1000')] bg-cover opacity-[0.02] pointer-events-none" />
                <div className="space-y-1 relative z-10">
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
                    {editingId ? '✦ Refine Masterpiece' : '✦ New Curated Treasure'}
                  </h2>
                  <p className="text-gold/40 text-[9px] font-black uppercase tracking-[0.3em]">Weaving pure quality into the catalog</p>
                </div>
                {editingId && (
                  <button onClick={cancelEditing} className="relative z-10 text-[9px] font-black uppercase tracking-[0.2em] bg-white/5 px-5 py-2.5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all w-full sm:w-auto text-center">Cancel Edit</button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="p-5 sm:p-10 space-y-6 sm:space-y-8">
                <div className="space-y-6 sm:space-y-8">

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Masterpiece Title</label>
                    <input
                      type="text" required placeholder="e.g. Traditional Cow Ghee"
                      className="w-full px-4 sm:px-6 py-3.5 sm:py-4.5 rounded-2xl bg-black/40 border border-white/10 focus:bg-[#061C2C] focus:border-gold focus:ring-4 focus:ring-gold/5 outline-none transition-all font-medium text-white text-sm placeholder:text-white/20 shadow-inner"
                      value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">The Craftsmanship Narrative</label>
                    <textarea
                      rows={4} required placeholder="Tell the story of this batch..."
                      className="w-full px-4 sm:px-6 py-3.5 sm:py-4.5 rounded-2xl bg-black/40 border border-white/10 focus:bg-[#061C2C] focus:border-gold focus:ring-4 focus:ring-gold/5 outline-none transition-all font-medium text-white text-sm placeholder:text-white/20 shadow-inner"
                      value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })}
                    />
                  </div>

                  {/* Image Gallery */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Image Gallery</label>
                      <button type="button" onClick={handleAddImage} className="text-[9px] font-black uppercase tracking-wider text-gold hover:text-white transition-colors">+ Add Image</button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {product.image_urls.map((url, idx) => (
                        <div key={idx} className="p-4 sm:p-5 bg-black/20 rounded-2xl sm:rounded-[2rem] border border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 shadow-sm hover:shadow transition-shadow relative">
                          <input
                            type="text" placeholder="https://unsplash.com/..." className="flex-1 bg-black/40 px-4 py-3 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-gold transition-all"
                            value={url} onChange={(e) => handleImageChange(idx, e.target.value)}
                          />
                          <div className="flex items-center gap-3 w-full sm:w-auto">
                            <label className="cursor-pointer bg-gold/10 text-gold hover:bg-gold hover:text-white px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all text-center flex-1 sm:flex-initial">
                              Upload <input type="file" className="hidden" onChange={(e) => e.target.files && handleFileUpload(idx, e.target.files[0])} />
                            </label>
                            <button type="button" onClick={() => handleRemoveImage(idx)} className="text-red-400 hover:text-red-600 transition-colors px-3 py-2.5 rounded-xl border border-red-500/10 hover:bg-red-500/10 text-[10px] font-black uppercase tracking-widest sm:border-none sm:p-2 sm:text-sm text-center flex-1 sm:flex-initial">Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Marketplaces */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Amazon Link</label>
                      <input
                        type="text" placeholder="https://amazon.in/..." className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 focus:bg-[#061C2C] focus:border-gold focus:ring-4 focus:ring-gold/5 outline-none text-xs text-white transition-all"
                        value={product.amazon_url} onChange={(e) => setProduct({ ...product, amazon_url: e.target.value })}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Flipkart Link</label>
                      <input
                        type="text" placeholder="https://flipkart.com/..." className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 focus:bg-[#061C2C] focus:border-gold focus:ring-4 focus:ring-gold/5 outline-none text-xs text-white transition-all"
                        value={product.blinkit_url} onChange={(e) => setProduct({ ...product, blinkit_url: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Variants */}
                  <div className="space-y-6 bg-white/[0.01] p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border border-white/5">
                    <div className="flex justify-between items-center gap-2">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Variants & Pricing</h3>
                      <button type="button" onClick={handleAddOption} className="bg-gold text-[#23212e] px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-[9px] font-black uppercase tracking-wider hover:bg-white transition-all shadow-md shadow-gold/10 hover:shadow-white/25">+ Add Size</button>
                    </div>
                    <div className="space-y-4">
                      {(product.quantity_options || []).map((opt, idx) => (
                        <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4 bg-black/30 p-4 sm:p-5 rounded-2xl sm:rounded-[2rem] shadow-sm border border-white/5 items-center">
                          <input placeholder="Size (e.g. 500ml, 1L)" className="text-xs font-bold p-3 border border-white/10 bg-black/40 text-white focus:bg-[#061C2C] focus:border-gold rounded-xl outline-none transition-all" value={opt.size} onChange={(e) => handleOptionChange(idx, 'size', e.target.value)} />
                          <input placeholder="Price (e.g. 1500 ₹)" type="number" className="text-xs font-bold p-3 border border-white/10 bg-black/40 text-white focus:bg-[#061C2C] focus:border-gold rounded-xl outline-none transition-all" value={opt.baseCost || ''} onChange={(e) => handleOptionChange(idx, 'baseCost', e.target.value === '' ? '' : Number(e.target.value))} />
                          <input placeholder="Discount (e.g. 10 %)" type="number" className="text-xs font-bold p-3 border border-white/10 bg-black/40 text-white focus:bg-[#061C2C] focus:border-gold rounded-xl outline-none transition-all" value={opt.discountPercentage || ''} onChange={(e) => handleOptionChange(idx, 'discountPercentage', e.target.value === '' ? '' : Number(e.target.value))} />
                          <button type="button" onClick={() => handleRemoveOption(idx)} className="text-red-400 hover:text-red-600 transition-colors text-[10px] font-black uppercase tracking-wider text-center sm:text-right py-2 rounded-xl border border-red-500/10 hover:bg-red-500/10 sm:border-none sm:p-0">Remove</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  {message.text && (
                    <div className={`mb-6 p-5 rounded-2xl text-xs font-bold transition-all animate-in fade-in ${message.type === 'success' ? 'bg-green-950/20 border border-green-500/20 text-green-400' : 'bg-red-950/20 border border-red-500/20 text-red-400'}`}>
                      {message.type === 'success' ? '✓' : '⚠️'} {message.text}
                    </div>
                  )}
                  <button
                    type="submit" disabled={loading}
                    className="w-full bg-[#fcc433] text-[#23212e] py-5 sm:py-6 rounded-2xl sm:rounded-3xl font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[10px] sm:text-xs shadow-2xl shadow-gold/20 hover:bg-white hover:text-[#23212e] border border-transparent hover:border-transparent transition-all duration-500 transform active:scale-[0.99] disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : (editingId ? 'Refine & Republish' : 'Publish to Catalog')}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Product List Section */}
          <div className="xl:col-span-5 space-y-8">
            <div className="flex items-center gap-3 ml-1">
              <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Current Catalog Collection</h3>
              <div className="h-px flex-1 bg-white/5" />
            </div>

            <div className="space-y-4 max-h-[850px] overflow-y-auto pr-2 no-scrollbar">
              {fetching ? (
                <div className="text-center py-32 text-white/20 font-serif italic text-lg animate-pulse">Accessing the vault...</div>
              ) : products.length === 0 ? (
                <div className="text-center py-32 text-white/30 font-serif italic">No treasures have been curated yet.</div>
              ) : products.map((p) => (
                <div key={p.id} className="bg-white/[0.02] backdrop-blur-md p-4 sm:p-5 rounded-2xl sm:rounded-[2.5rem] border border-white/5 shadow-[0_15px_40px_rgba(0,0,0,0.3)] flex items-center gap-4 sm:gap-6 group hover:border-gold/40 hover:shadow-2xl transition-all duration-500">
                  <div className="h-16 w-16 sm:h-24 sm:w-24 rounded-xl sm:rounded-2xl overflow-hidden bg-black/40 border border-white/5 shadow-inner flex-shrink-0">
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm sm:text-base font-serif font-bold text-white leading-tight mb-1 sm:mb-2 truncate group-hover:text-gold transition-colors">{p.name}</h4>
                    <p className="text-[9px] sm:text-[10px] text-white/40 font-black uppercase tracking-wider">
                      ₹{p.quantity_options?.[0]?.baseCost || 0} • {p.quantity_options?.length || 0} Var
                    </p>
                  </div>
                  <div className="flex flex-col gap-2.5 sm:gap-3 flex-shrink-0">
                    <button onClick={() => startEditing(p)} className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-gold hover:text-white transition-colors text-right">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-red-400 hover:text-red-500 transition-colors text-right">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
