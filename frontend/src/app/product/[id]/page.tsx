"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import supabase from '../../../config/supabase';
import { useUser } from '@/context/UserContext';
import UserAuthModal from '@/components/UserAuthModal';

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [product, setProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setProduct(data);
        if (!selectedSize || selectedSize.size === data.quantity_options[0].size) {
          setSelectedSize(data.quantity_options[0]);
        }
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id, product?.name]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-serif italic text-forest">Loading Masterpiece...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;

  const allImages = Array.from(new Set([
    product.image_url, 
    ...(product.image_urls || [])
  ])).filter(url => url && url.trim() !== '');

  const finalPrice = selectedSize.baseCost - (selectedSize.baseCost * (selectedSize.discountPercentage / 100));

  const handleWhatsAppOrder = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    const text = `*New Artisan Order Inquiry*%0A%0A*Customer:* ${user.name}%0A*Phone:* ${user.phone}%0A*Address:* ${user.address}%0A%0A*Product:* ${product.name}%0A*Size:* ${selectedSize.size}%0A*Quantity:* ${quantity}%0A*Price:* ₹${finalPrice * quantity}%0A%0APlease let me know the next steps!`;
    window.open(`https://wa.me/919990001111?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white pb-20 px-4 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto pt-12 flex flex-col lg:flex-row gap-16">
        
        {/* Left: Image Gallery */}
        <div className="lg:w-3/5 grid grid-cols-1 md:grid-cols-2 gap-4 h-fit relative">
          {selectedSize.discountPercentage > 0 && (
            <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 z-10 rounded-lg shadow-2xl">
              {selectedSize.discountPercentage}% OFF
            </div>
          )}
          {allImages.map((url, idx) => (
            <div key={idx} className="aspect-[3/4] overflow-hidden bg-cream/10 rounded-lg">
              <img 
                src={url} 
                alt={`${product.name} ${idx}`}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000"
              />
            </div>
          ))}
        </div>

        {/* Right: Product Info */}
        <div className="lg:w-2/5 lg:sticky lg:top-32 h-fit space-y-12">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">Pure Handcrafted Artisan</span>
                <div className="h-px w-12 bg-gold/20" />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-forest leading-[1.1] tracking-tighter">
                {product.name}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-forest">₹{finalPrice.toFixed(0)}</div>
              {selectedSize.discountPercentage > 0 && (
                <div className="flex flex-col">
                  <div className="text-sm text-forest/20 line-through">₹{selectedSize.baseCost}</div>
                  <div className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                    Save {selectedSize.discountPercentage}%
                  </div>
                </div>
              )}
              <span className="text-[10px] text-forest/40 uppercase font-black tracking-widest ml-auto">Free Delivery</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 py-8 border-y border-forest/5">
            <div className="text-center space-y-2">
              <div className="text-gold text-xl">🏺</div>
              <p className="text-[8px] font-black uppercase tracking-widest text-forest/60">A2 Vedic</p>
            </div>
            <div className="text-center space-y-2 border-x border-forest/5">
              <div className="text-gold text-xl">🌿</div>
              <p className="text-[8px] font-black uppercase tracking-widest text-forest/60">100% Pure</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-gold text-xl">✨</div>
              <p className="text-[8px] font-black uppercase tracking-widest text-forest/60">Handmade</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-forest/40 uppercase tracking-[0.2em]">Select Volume</h3>
            <div className="flex flex-wrap gap-3">
              {product.quantity_options.map((option: any) => (
                <button
                  key={option.size}
                  onClick={() => setSelectedSize(option)}
                  className={`px-6 py-3 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-widest ${
                    selectedSize.size === option.size
                      ? 'border-forest text-forest bg-forest/5'
                      : 'border-forest/5 text-forest/30 hover:border-forest/20'
                  }`}
                >
                  {option.size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6 pt-4">
            <button 
              onClick={handleWhatsAppOrder}
              className="w-full bg-[#25D366] text-white py-5 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-2xl shadow-green-500/20 hover:translate-y-[-2px] active:translate-y-0 transition-all flex items-center justify-center gap-3 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Acquire via WhatsApp
            </button>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => product.amazon_url && window.open(product.amazon_url, '_blank')}
                className={`py-4 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                  product.amazon_url 
                    ? 'bg-forest text-white hover:bg-[#FF9900] shadow-xl shadow-orange-500/10' 
                    : 'bg-forest/5 text-forest/20 cursor-not-allowed border border-forest/5'
                }`}
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg" className={`w-4 h-4 ${product.amazon_url ? 'brightness-0 invert' : 'opacity-20'}`} alt="Amazon" />
                Amazon {!product.amazon_url && '(Soon)'}
              </button>
              <button 
                onClick={() => product.blinkit_url && window.open(product.blinkit_url, '_blank')}
                className={`py-4 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                  product.blinkit_url 
                    ? 'bg-[#FFD33D] text-black hover:bg-yellow-400 shadow-xl shadow-yellow-500/10' 
                    : 'bg-forest/5 text-forest/20 cursor-not-allowed border border-forest/5'
                }`}
              >
                <span className={`font-black italic ${!product.blinkit_url && 'opacity-20'}`}>blinkit</span>
                {!product.blinkit_url && '(Soon)'}
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-8 border-t border-forest/5">
            <h3 className="text-[10px] font-black text-forest/40 uppercase tracking-[0.2em]">The Narrative</h3>
            <p className="text-forest/70 text-sm leading-relaxed font-serif italic">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      <UserAuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onAuthenticated={() => handleWhatsAppOrder()}
      />
    </div>
  );
}
