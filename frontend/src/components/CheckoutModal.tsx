"use client";
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface CartItem {
  id: string;
  name: string;
  image: string;
  size: string;
  basePrice: number;
  quantity: number;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (checkoutData: CheckoutData) => Promise<void>;
  cart: CartItem[];
  cartTotal: number;
  defaultName: string;
  defaultPhone: string;
  defaultEmail: string;
  defaultAddress: string;
  isBooking: boolean;
  bookingError: string;
  bookingSuccess: boolean;
}

export interface CheckoutData {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
  paymentMethod: 'cod' | 'upi' | 'whatsapp';
}

// UPI ID for Milgan Foods — update this to your actual UPI ID
const MERCHANT_UPI_ID = '8660013411@ybl';
const MERCHANT_NAME = 'Milgan Foods';

type Step = 'address' | 'success';

export default function CheckoutModal({
  isOpen,
  onClose,
  onConfirm,
  cart,
  cartTotal,
  defaultName,
  defaultPhone,
  defaultEmail,
  defaultAddress,
  isBooking,
  bookingError,
  bookingSuccess,
}: CheckoutModalProps) {
  const [step, setStep] = useState<Step>('address');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'whatsapp' | null>(null);

  // Address form state
  const [name, setName] = useState(defaultName || '');
  const [phone, setPhone] = useState(defaultPhone || '');
  const [email, setEmail] = useState(defaultEmail || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [state, setState] = useState('Karnataka');
  const [formError, setFormError] = useState('');

  // Parse default address into fields if available
  useEffect(() => {
    if (defaultAddress && !address) {
      setAddress(defaultAddress);
    }
    if (defaultName) setName(defaultName);
    if (defaultPhone) setPhone(defaultPhone);
    if (defaultEmail) setEmail(defaultEmail);
  }, [defaultName, defaultPhone, defaultEmail, defaultAddress]);

  // Reset to address step when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('address');
      setPaymentMethod(null);
      setFormError('');
    }
  }, [isOpen]);

  // Auto-advance to success when booking succeeds
  useEffect(() => {
    if (bookingSuccess) {
      setStep('success');
    }
  }, [bookingSuccess]);

  if (!isOpen) return null;

  const validateAddress = () => {
    if (!name.trim()) return 'Full name is required';
    if (!phone.trim() || phone.length < 10) return 'Valid phone number is required';
    if (!address.trim()) return 'Street address is required';
    if (!city.trim()) return 'City is required';
    if (!pincode.trim() || pincode.length !== 6) return 'Valid 6-digit pincode is required';
    if (!state.trim()) return 'State is required';
    return '';
  };

  const handleConfirmWhatsAppOrder = async () => {
    const err = validateAddress();
    if (err) { setFormError(err); return; }
    setFormError('');
    setPaymentMethod('whatsapp');
    await onConfirm({
      name, phone, email, address, city, pincode, state,
      paymentMethod: 'whatsapp',
    });
  };

  // UPI deep link for QR
  const upiLink = `upi://pay?pa=${encodeURIComponent(MERCHANT_UPI_ID)}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${cartTotal}&cu=INR&tn=${encodeURIComponent('Milgan Foods Order')}`;
  const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(upiLink)}&size=220&margin=2&ecLevel=M&dark=124B70&light=fef9ec`;

  const indianStates = [
    'Karnataka',
  ];

  const inputClass = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#fdce47]/60 focus:bg-white/8 transition-all duration-200";
  const labelClass = "block text-[9px] font-black uppercase tracking-widest text-white/50 mb-1.5";

  const modalContent = (
    <div className="fixed inset-0 w-screen h-screen z-[99999] flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={step !== 'success' ? onClose : undefined}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-[#1a1828] border border-white/10 rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden animate-in zoom-in-95 fade-in duration-300 max-h-[95vh] flex flex-col">

        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-[#fdce47]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative p-6 border-b border-white/8 flex items-center justify-between flex-shrink-0">
          <div className="space-y-0.5">
            <h2 className="text-lg font-serif font-bold text-white">
              {step === 'address' && '📦 Delivery Details'}
              {step === 'success' && '✅ Order Confirmed!'}
            </h2>
            <p className="text-[9px] font-black uppercase tracking-widest text-white/40">
              {step === 'address' && 'Where should we deliver your order?'}
              {step === 'success' && 'Your order is placed and on its way!'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 flex items-center justify-center text-sm transition-all"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 scrollbar-none">

          {/* ── STEP 1: ADDRESS FORM ── */}
          {step === 'address' && (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className={labelClass}>Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your full name"
                    className={inputClass}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className={labelClass}>Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit mobile number"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Email (optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Street Address / Flat No.</label>
                <textarea
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Flat/House no., Building name, Street..."
                  rows={2}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>City</label>
                  <select
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="" className="bg-[#1a1828] text-white/50">Select your city</option>
                    <option value="Tumkur" className="bg-[#1a1828] text-white">Tumkur</option>
                    <option value="Bengalore" className="bg-[#1a1828] text-white">Bengalore</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={e => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="6-digit PIN"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>State</label>
                <select
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className={`${inputClass} cursor-pointer`}
                >
                  {indianStates.map(s => (
                    <option key={s} value={s} className="bg-[#1a1828] text-white">{s}</option>
                  ))}
                </select>
              </div>

              {formError && (
                <div className="text-red-400 text-[10px] font-semibold bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                  ⚠️ {formError}
                </div>
              )}

              {bookingError && (
                <div className="text-red-400 text-[10px] font-semibold bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                  ⚠️ {bookingError}
                </div>
              )}

              {/* Order summary mini */}
              <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-4 space-y-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-3">Order Summary</p>
                {cart.map(item => (
                  <div key={`${item.id}-${item.size}`} className="flex justify-between items-center text-xs">
                    <span className="text-white/70 font-medium">{item.name} <span className="text-white/30">({item.size})</span> × {item.quantity}</span>
                    <span className="text-[#fdce47] font-black font-mono">₹{item.basePrice * item.quantity}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-white/8 flex justify-between">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Total Payable</span>
                  <span className="text-[#fdce47] font-black text-base font-mono">₹{cartTotal}</span>
                </div>
              </div>
            </div>
          )}


          {/* ── STEP 4: SUCCESS ── */}
          {step === 'success' && (
            <div className="p-8 text-center space-y-6">
              <div className="relative mx-auto w-24 h-24">
                <div className="absolute inset-0 bg-[#fdce47]/20 rounded-full animate-ping" />
                <div className="relative w-24 h-24 bg-[#fdce47]/15 border border-[#fdce47]/40 rounded-full flex items-center justify-center text-4xl">
                  🎉
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold text-white">Order Placed!</h3>
                <p className="text-white/60 text-sm font-serif italic leading-relaxed">
                  Your WhatsApp order has been registered and will be dispatched shortly.
                </p>
              </div>
              <div className="bg-white/[0.04] border border-white/8 rounded-2xl p-5 text-left space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white/40 font-semibold">Delivering To</span>
                  <span className="text-white font-bold">{name}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/40 font-semibold">Total</span>
                  <span className="text-[#fdce47] font-black font-mono">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/40 font-semibold">Payment</span>
                  <span className="text-white font-bold capitalize">
                    WhatsApp
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-full py-4 bg-gradient-to-r from-[#ffdb71] to-[#fdce47] text-[#124B70] rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-lg active:scale-[0.98] transition-all"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>

        {/* Footer action — Address step only */}
        {step === 'address' && (
          <div className="p-6 border-t border-white/8 flex-shrink-0">
            <button
              onClick={handleConfirmWhatsAppOrder}
              disabled={isBooking}
              className="w-full py-4 bg-[#25D366] text-white hover:bg-green-600 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-lg active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isBooking ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Redirecting to WhatsApp...
                </>
              ) : (
                '✓ Order via WhatsApp'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
}
