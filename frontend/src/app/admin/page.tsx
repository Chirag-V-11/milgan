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
      const response = await fetch(`http://localhost:5000/api/products?t=${Date.now()}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchProducts();
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
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
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
      const url = editingId 
        ? `http://localhost:5000/api/products/${editingId}`
        : 'http://localhost:5000/api/products';
      
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
    <div className="min-h-screen bg-[#FDFCFB] p-4 md:p-12 font-sans selection:bg-gold/30">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <div className="space-y-1">
            <h1 className="text-5xl font-serif font-bold text-forest tracking-tighter">Boutique <span className="text-gold italic">Control</span></h1>
            <p className="text-forest/40 font-medium">Manage your golden legacy and curated treasures</p>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/admin/users" className="text-[10px] font-black uppercase tracking-widest bg-gold/10 text-gold px-8 py-3 rounded-full hover:bg-gold hover:text-white transition-all">Artisans</Link>
            <Link href="/" className="text-[10px] font-black uppercase tracking-widest border border-forest/10 px-8 py-3 rounded-full hover:bg-forest hover:text-white transition-all">Visit Boutique</Link>
            <button onClick={handleLogout} className="bg-red-50 text-red-600 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all">Logout</button>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">
          
          {/* Form Section */}
          <div className="xl:col-span-7 space-y-8">
            <div className="bg-white rounded-[2.5rem] shadow-[0_40px_100px_rgba(27,67,50,0.05)] border border-gold/5 overflow-hidden">
              <div className="bg-forest p-8 text-white flex justify-between items-center">
                <h2 className="text-2xl font-serif font-bold">
                  {editingId ? '✦ Refine Masterpiece' : '✦ New Curated Treasure'}
                </h2>
                {editingId && (
                  <button onClick={cancelEditing} className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-4 py-2 rounded-full hover:bg-white/20">Cancel Edit</button>
                )}
              </div>
              
              <form onSubmit={handleSubmit} className="p-10 space-y-10">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-forest/40 uppercase tracking-widest ml-1">Masterpiece Title</label>
                    <input
                      type="text" required placeholder="e.g. Traditional A2 Gir Cow Ghee"
                      className="w-full px-6 py-4 rounded-2xl bg-cream/20 border border-transparent focus:bg-white focus:border-gold/30 outline-none transition-all font-medium text-forest"
                      value={product.name} onChange={(e) => setProduct({...product, name: e.target.value})}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-forest/40 uppercase tracking-widest ml-1">The Craftsmanship Narrative</label>
                    <textarea
                      rows={4} required placeholder="Tell the story of this batch..."
                      className="w-full px-6 py-4 rounded-2xl bg-cream/20 border border-transparent focus:bg-white focus:border-gold/30 outline-none transition-all font-medium text-forest"
                      value={product.description} onChange={(e) => setProduct({...product, description: e.target.value})}
                    />
                  </div>

                  {/* Image Gallery */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-[10px] font-black text-forest/40 uppercase tracking-widest">Image Gallery</label>
                      <button type="button" onClick={handleAddImage} className="text-[10px] font-bold text-gold">+ Add Image</button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {product.image_urls.map((url, idx) => (
                        <div key={idx} className="p-4 bg-cream/10 rounded-2xl border border-forest/5 flex items-center gap-4">
                          <input
                            type="text" placeholder="URL..." className="flex-1 bg-white px-4 py-2 rounded-lg text-xs"
                            value={url} onChange={(e) => handleImageChange(idx, e.target.value)}
                          />
                          <label className="cursor-pointer bg-gold/10 text-gold px-3 py-2 rounded-lg text-[9px] font-bold uppercase">
                            Upload <input type="file" className="hidden" onChange={(e) => e.target.files && handleFileUpload(idx, e.target.files[0])} />
                          </label>
                          <button type="button" onClick={() => handleRemoveImage(idx)} className="text-red-300 hover:text-red-500">✕</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Marketplaces */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-forest/40 uppercase tracking-widest ml-1">Amazon Link</label>
                      <input
                        type="text" placeholder="https://..." className="w-full px-4 py-3 rounded-xl bg-cream/10 border-transparent focus:bg-white outline-none text-xs"
                        value={product.amazon_url} onChange={(e) => setProduct({...product, amazon_url: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-forest/40 uppercase tracking-widest ml-1">Blinkit Link</label>
                      <input
                        type="text" placeholder="https://..." className="w-full px-4 py-3 rounded-xl bg-cream/10 border-transparent focus:bg-white outline-none text-xs"
                        value={product.blinkit_url} onChange={(e) => setProduct({...product, blinkit_url: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Variants */}
                  <div className="space-y-6 bg-cream/20 p-8 rounded-[2rem]">
                    <div className="flex justify-between items-center">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-forest">Variants & Pricing</h3>
                      <button type="button" onClick={handleAddOption} className="bg-forest text-white px-4 py-2 rounded-full text-[9px] font-bold">+ Add Size</button>
                    </div>
                    <div className="space-y-3">
                      {product.quantity_options.map((opt, idx) => (
                        <div key={idx} className="grid grid-cols-4 gap-3 bg-white p-4 rounded-xl shadow-sm">
                          <input placeholder="Size" className="text-xs font-bold p-2 bg-cream/20 rounded" value={opt.size} onChange={(e) => handleOptionChange(idx, 'size', e.target.value)} />
                          <input placeholder="Price" type="number" className="text-xs font-bold p-2 bg-cream/20 rounded" value={opt.baseCost} onChange={(e) => handleOptionChange(idx, 'baseCost', Number(e.target.value))} />
                          <input placeholder="Disc%" type="number" className="text-xs font-bold p-2 bg-cream/20 rounded" value={opt.discountPercentage} onChange={(e) => handleOptionChange(idx, 'discountPercentage', Number(e.target.value))} />
                          <button type="button" onClick={() => handleRemoveOption(idx)} className="text-red-300">Remove</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  {message.text && (
                    <div className={`mb-6 p-4 rounded-xl text-xs font-bold ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {message.text}
                    </div>
                  )}
                  <button
                    type="submit" disabled={loading}
                    className="w-full bg-gold text-white py-6 rounded-3xl font-black uppercase tracking-[0.4em] text-xs shadow-xl shadow-gold/20 hover:scale-[1.01] transition-all"
                  >
                    {loading ? 'Processing...' : (editingId ? 'Refine & Republish' : 'Publish to Boutique')}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Product List Section */}
          <div className="xl:col-span-5 space-y-8">
            <h3 className="text-[10px] font-black text-forest/40 uppercase tracking-widest ml-1">Current Boutique Collection</h3>
            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 no-scrollbar">
              {fetching ? (
                <div className="text-center py-20 text-forest/20 font-serif italic">Accessing the vault...</div>
              ) : products.map((p) => (
                <div key={p.id} className="bg-white p-4 rounded-[2rem] border border-gold/5 shadow-sm flex items-center gap-6 group hover:border-gold/30 transition-all">
                  <div className="h-20 w-20 rounded-2xl overflow-hidden bg-cream/10">
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-forest leading-tight mb-1">{p.name}</h4>
                    <p className="text-[10px] text-forest/40 font-medium uppercase tracking-widest">₹{p.quantity_options[0]?.baseCost} • {p.quantity_options.length} Sizes</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => startEditing(p)} className="text-[9px] font-black uppercase tracking-widest text-gold hover:text-gold-dark">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-[9px] font-black uppercase tracking-widest text-red-300 hover:text-red-500">Delete</button>
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
