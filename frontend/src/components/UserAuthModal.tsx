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
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [isOTPResetMode, setIsOTPResetMode] = useState(false);
  const [isOTPRegisterMode, setIsOTPRegisterMode] = useState(false);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    password: ''
  });

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
  };

  // Reset all inputs when modal opens or shifts modes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
        password: ''
      });
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setIsForgotPasswordMode(false);
      setIsOTPResetMode(false);
      setIsOTPRegisterMode(false);
      setIsLoginMode(true);
      setNotification(null);
    }
  }, [isOpen]);


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
    setNotification(null);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://milgan-backend.onrender.com';

    try {
      if (isForgotPasswordMode) {
        // Step 1: Send Forgot Password OTP
        const response = await fetch(`${apiBase}/api/users/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email })
        });
        const data = await response.json();
        if (response.ok) {
          showNotification(data.message || 'OTP sent successfully to your email.', 'success');
          setIsForgotPasswordMode(false);
          setIsOTPResetMode(true);
        } else {
          showNotification(data.error || 'Failed to send OTP.', 'error');
        }
      } else if (isOTPResetMode) {
        // Step 2: Verify OTP & Reset Password
        if (newPassword !== confirmPassword) {
          showNotification('Passwords do not match!', 'error');
          setLoading(false);
          return;
        }
        const response = await fetch(`${apiBase}/api/users/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, otp, newPassword })
        });
        const data = await response.json();
        if (response.ok) {
          showNotification(data.message || 'Password updated successfully!', 'success');
          setIsOTPResetMode(false);
          setIsLoginMode(true);
          setOtp('');
          setNewPassword('');
          setConfirmPassword('');
        } else {
          showNotification(data.error || 'Failed to reset password.', 'error');
        }
      } else if (isOTPRegisterMode) {
        // Step 2 of Registration: Verify OTP and Register Profile
        const response = await fetch(`${apiBase}/api/users/verify-register-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, otp })
        });
        const data = await response.json();
        if (response.ok) {
          login(data);
          if (onAuthenticated) onAuthenticated();
          onClose();
          setIsOTPRegisterMode(false);
          setOtp('');
        } else {
          showNotification(data.error || 'Invalid OTP code.', 'error');
        }
      } else if (isLoginMode) {
        // Normal Login
        const response = await fetch(`${apiBase}/api/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: formData.phone, password: formData.password })
        });
        const data = await response.json();
        if (response.ok) {
          login(data);
          if (onAuthenticated) onAuthenticated();
          onClose();
        } else {
          showNotification(data.error || 'Invalid credentials.', 'error');
        }
      } else {
        // Normal Register -> Request registration OTP
        const response = await fetch(`${apiBase}/api/users/register-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (response.ok) {
          showNotification(data.message || 'Verification OTP sent to your email.', 'success');
          setIsOTPRegisterMode(true);
        } else {
          showNotification(data.error || 'Registration failed.', 'error');
        }
      }
    } catch (error) {
      showNotification('Connection failed. Please check your boutique server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Content Styling
  let sideTitle = isLoginMode ? 'Welcome Back.' : 'The Artisan Register.';
  if (isForgotPasswordMode || isOTPResetMode) {
    sideTitle = 'Recover Legacy.';
  } else if (isOTPRegisterMode) {
    sideTitle = 'Verify Identity.';
  }

  let title = 'Sign In';
  let subtitle = 'Enter your credentials';
  if (isForgotPasswordMode) {
    title = 'Recover Key';
    subtitle = 'Enter your email to request recovery';
  } else if (isOTPResetMode) {
    title = 'Reset Golden Key';
    subtitle = 'Enter OTP and your new password';
  } else if (isOTPRegisterMode) {
    title = 'Verify Profile';
    subtitle = 'Enter the OTP sent to your email';
  } else if (!isLoginMode) {
    title = 'Join the Legacy';
    subtitle = 'Begin your journey with the purest ghee';
  }

  let submitButtonText = 'Access My Legacy';
  if (loading) {
    submitButtonText = 'Processing...';
  } else if (isForgotPasswordMode) {
    submitButtonText = 'Send Recovery Code';
  } else if (isOTPResetMode) {
    submitButtonText = 'Verify & Update Key';
  } else if (isOTPRegisterMode) {
    submitButtonText = 'Verify & Create Profile';
  } else if (!isLoginMode) {
    submitButtonText = 'Confirm & Join';
  }

  const modalContent = (
    <div className="fixed inset-0 w-screen h-screen z-[99999] grid place-items-center p-6 bg-[#23212e]/95 backdrop-blur-xl transition-all duration-500 overflow-y-auto font-sans text-white">
      <div className="fixed inset-0 cursor-pointer" onClick={onClose} />

      <div className="relative bg-[#23212e] w-full max-w-2xl rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.6),0_0_80px_rgba(252,196,51,0.15)] overflow-hidden transition-all duration-700 flex flex-col md:flex-row border border-white/10 animate-in zoom-in-95 duration-500">

        {/* Decorative Side Narrative */}
        <div className="md:w-1/3 bg-[#244b82] p-10 text-white flex flex-col justify-between relative overflow-hidden border-r border-white/10">
          <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[url('https://images.unsplash.com/photo-1582233228805-72861066532d?auto=format&fit=crop&q=80&w=1000')] bg-cover" />
          <div className="relative z-10 space-y-4">
            <div className="text-5xl animate-bounce-slow">🏺</div>
            <h2 className="text-2xl font-serif font-bold leading-tight tracking-tight">
              {sideTitle}
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
              {title}
            </h3>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground/40">
              {subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {notification && (
              <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between transition-all animate-fadeIn ${
                notification.type === 'success'
                  ? 'bg-green-950/20 text-green-400 border-green-500/20 shadow-[0_4px_20px_rgba(34,197,94,0.05)]'
                  : 'bg-red-950/20 text-red-400 border-red-500/20 shadow-[0_4px_20px_rgba(239,68,68,0.05)]'
              }`}>
                <span>{notification.message}</span>
                <button
                  type="button"
                  onClick={() => setNotification(null)}
                  className="ml-3 hover:text-white transition-opacity opacity-60 hover:opacity-100 text-xs"
                >
                  ✕
                </button>
              </div>
            )}
            {/* Decoy inputs to capture browser autofill and keep user-visible fields blank */}
            <input
              type="text"
              name="email"
              autoComplete="username"
              tabIndex={-1}
              style={{ position: 'absolute', top: '-1000px', left: '-1000px', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none' }}
            />
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              tabIndex={-1}
              style={{ position: 'absolute', top: '-1000px', left: '-1000px', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none' }}
            />
            <div className="space-y-5">

              {isForgotPasswordMode && (
                <div className="space-y-1 group">
                  <label className="text-[9px] font-black text-foreground/40 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-gold">Email Address</label>
                  <input
                    required type="email" placeholder="john@example.com"
                    className="w-full px-0 py-2 bg-transparent border-b border-white/10 focus:border-gold outline-none transition-all text-sm font-medium text-white placeholder:text-white/20"
                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              )}

              {isOTPRegisterMode && (
                <div className="space-y-1 group">
                  <label className="text-[9px] font-black text-foreground/40 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-gold">6-Digit Verification OTP</label>
                  <input
                    required type="text" maxLength={6} placeholder="123456"
                    className="w-full px-0 py-2 bg-transparent border-b border-white/10 focus:border-gold outline-none transition-all text-sm font-medium text-center text-gold font-mono tracking-[1em]"
                    value={otp} onChange={e => setOtp(e.target.value)}
                  />
                </div>
              )}

              {isOTPResetMode && (
                <>
                  <div className="space-y-1 group">
                    <label className="text-[9px] font-black text-foreground/40 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-gold">6-Digit Verification OTP</label>
                    <input
                      required type="text" maxLength={6} placeholder="123456"
                      className="w-full px-0 py-2 bg-transparent border-b border-white/10 focus:border-gold outline-none transition-all text-sm font-medium text-center text-gold font-mono tracking-[1em]"
                      value={otp} onChange={e => setOtp(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1 group">
                    <label className="text-[9px] font-black text-foreground/40 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-gold">New Password</label>
                    <div className="relative w-full">
                      <input
                        required type={showNewPassword ? "text" : "password"} placeholder="••••••••"
                        name="new-password"
                        autoComplete="new-password"
                        className="w-full px-0 pr-8 py-2 bg-transparent border-b border-white/10 focus:border-gold outline-none transition-all text-sm font-medium text-white placeholder:text-white/20"
                        value={newPassword} onChange={e => setNewPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40 hover:text-gold transition-colors p-1"
                        title={showNewPassword ? "Hide Password" : "Show Password"}
                      >
                        {showNewPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0,0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0,1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0,1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1,0-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0,1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1,1-6 0 3 3 0 0,1 6 0Z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1 group">
                    <label className="text-[9px] font-black text-foreground/40 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-gold">Confirm Password</label>
                    <div className="relative w-full">
                      <input
                        required type={showConfirmPassword ? "text" : "password"} placeholder="••••••••"
                        name="confirm-password"
                        autoComplete="new-password"
                        className="w-full px-0 pr-8 py-2 bg-transparent border-b border-white/10 focus:border-gold outline-none transition-all text-sm font-medium text-white placeholder:text-white/20"
                        value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40 hover:text-gold transition-colors p-1"
                        title={showConfirmPassword ? "Hide Password" : "Show Password"}
                      >
                        {showConfirmPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0,0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0,1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0,1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1,0-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0,1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1,1-6 0 3 3 0 0,1 6 0Z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {!isForgotPasswordMode && !isOTPResetMode && !isOTPRegisterMode && (
                <>
                  {!isLoginMode && (
                    <div className="space-y-1 group">
                      <label className="text-[9px] font-black text-foreground/40 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-gold">Full Name</label>
                      <input
                        required type="text" placeholder="John Doe"
                        className="w-full px-0 py-2 bg-transparent border-b border-white/10 focus:border-gold outline-none transition-all text-sm font-medium text-white placeholder:text-white/20"
                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  )}

                  <div className={`grid ${isLoginMode ? 'grid-cols-1' : 'grid-cols-2'} gap-6`}>
                    <div className="space-y-1 group">
                      <label className="text-[9px] font-black text-foreground/40 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-gold">Phone Number</label>
                      <input
                        required type="tel" placeholder="+91 ..."
                        name="user-phone"
                        autoComplete="tel"
                        className="w-full px-0 py-2 bg-transparent border-b border-white/10 focus:border-gold outline-none transition-all text-sm font-medium text-white placeholder:text-white/20"
                        value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    {!isLoginMode && (
                      <div className="space-y-1 group">
                        <label className="text-[9px] font-black text-foreground/40 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-gold">Email Address</label>
                        <input
                          required type="email" placeholder="john@example.com"
                          className="w-full px-0 py-2 bg-transparent border-b border-white/10 focus:border-gold outline-none transition-all text-sm font-medium text-white placeholder:text-white/20"
                          value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1 group">
                    <label className="text-[9px] font-black text-foreground/40 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-gold">Password</label>
                    <div className="relative w-full">
                      <input
                        required type={showPassword ? "text" : "password"} placeholder="••••••••"
                        name="user-password"
                        autoComplete="current-password"
                        className="w-full px-0 pr-8 py-2 bg-transparent border-b border-white/10 focus:border-gold outline-none transition-all text-sm font-medium text-white placeholder:text-white/20"
                        value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40 hover:text-gold transition-colors p-1"
                        title={showPassword ? "Hide Password" : "Show Password"}
                      >
                        {showPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0,0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0,1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0,1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1,0-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0,1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1,1-6 0 3 3 0 0,1 6 0Z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {!isLoginMode && (
                    <div className="space-y-1 group">
                      <label className="text-[9px] font-black text-foreground/40 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-gold">Delivery Sanctuary (Address)</label>
                      <textarea
                        required rows={2} placeholder="House No, Street, City, State, PIN"
                        className="w-full px-0 py-2 bg-transparent border-b border-white/10 focus:border-gold outline-none transition-all text-sm font-medium resize-none text-white placeholder:text-white/20"
                        value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="space-y-5 pt-2">
              <button
                type="submit" disabled={loading}
                className="w-full bg-gold text-[#23212e] py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[9px] shadow-2xl hover:bg-[#e1ddde] hover:text-[#23212e] transition-all disabled:opacity-50 border border-transparent"
              >
                {submitButtonText}
              </button>

              <div className="flex justify-between items-center px-1">
                {(isForgotPasswordMode || isOTPResetMode || isOTPRegisterMode) ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPasswordMode(false);
                      setIsOTPResetMode(false);
                      if (isOTPRegisterMode) {
                        setIsLoginMode(false);
                        setIsOTPRegisterMode(false);
                      } else {
                        setIsLoginMode(true);
                      }
                      setFormData({
                        name: '',
                        phone: '',
                        email: '',
                        address: '',
                        password: ''
                      });
                      setOtp('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                    className="text-[8px] font-black uppercase tracking-widest text-[#fdce47] hover:text-white transition-colors"
                  >
                    ← Back to {isOTPRegisterMode ? 'Register' : 'Sign In'}
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsLoginMode(!isLoginMode);
                        setFormData({
                          name: '',
                          phone: '',
                          email: '',
                          address: '',
                          password: ''
                        });
                        setOtp('');
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                      className="text-[8px] font-black uppercase tracking-widest text-foreground/50 hover:text-gold transition-colors"
                    >
                      {isLoginMode ? "New? Register" : "Returning Artisan?"}
                    </button>
                    {isLoginMode && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPasswordMode(true);
                          setIsLoginMode(false);
                        }}
                        className="text-[8px] font-black uppercase tracking-widest text-[#fdce47] hover:text-white transition-colors"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </>
                )}
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
