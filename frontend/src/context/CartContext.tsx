"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';

export interface CartItem {
  id: string;
  name: string;
  image: string;
  size: string; // e.g. "500ml", "1L"
  basePrice: number; // calculated price per item
  originalPrice: number; // original price before discount
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user } = useUser();

  // Load cart from localStorage once on client side initialization (guest cart)
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('milgen_cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
    setIsInitialized(true);
  }, []);

  // Sync / load cart when user changes
  useEffect(() => {
    if (!isInitialized) return;

    const syncUserCart = async () => {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://milgan-backend.onrender.com';
      if (user) {
        try {
          // If we have items in the guest cart, upload/sync them to the DB
          if (cart.length > 0) {
            console.log("Syncing guest cart with database for user:", user.id);
            for (const item of cart) {
              await fetch(`${apiBase}/api/cart`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-user-id': user.id
                },
                body: JSON.stringify({
                  productId: item.id,
                  size: item.size,
                  quantity: item.quantity
                })
              });
            }
            // Clear local storage guest cart so it doesn't double-sync next time
            localStorage.removeItem('milgen_cart');
          }

          // Fetch the combined cart from DB
          const res = await fetch(`${apiBase}/api/cart`, {
            headers: { 'x-user-id': user.id }
          });
          if (res.ok) {
            const dbCart = await res.json();
            setCart(dbCart);
          }
        } catch (error) {
          console.error("Failed to sync cart with database", error);
        }
      } else {
        // User logged out: clear cart state
        setCart([]);
      }
    };

    syncUserCart();
  }, [user, isInitialized]);

  // Save to localStorage when cart changes (only for guest user)
  useEffect(() => {
    if (isInitialized && !user) {
      try {
        localStorage.setItem('milgen_cart', JSON.stringify(cart));
      } catch (e) {
        console.error("Failed to save cart to localStorage", e);
      }
    }
  }, [cart, isInitialized, user]);

  const addToCart = async (item: Omit<CartItem, 'quantity'>, quantity: number) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (i) => i.id === item.id && i.size === item.size
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        return [...prevCart, { ...item, quantity }];
      }
    });

    if (user) {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://milgan-backend.onrender.com';
        await fetch(`${apiBase}/api/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': user.id
          },
          body: JSON.stringify({
            productId: item.id,
            size: item.size,
            quantity
          })
        });
      } catch (e) {
        console.error("Failed to add to database cart", e);
      }
    }

    setIsOpen(true);
  };

  const removeFromCart = async (id: string, size: string) => {
    setCart((prevCart) => prevCart.filter((item) => !(item.id === id && item.size === size)));

    if (user) {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://milgan-backend.onrender.com';
        await fetch(`${apiBase}/api/cart?productId=${id}&size=${size}`, {
          method: 'DELETE',
          headers: { 'x-user-id': user.id }
        });
      } catch (e) {
        console.error("Failed to remove from database cart", e);
      }
    }
  };

  const updateQuantity = async (id: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.size === size ? { ...item, quantity } : item
      )
    );

    if (user) {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://milgan-backend.onrender.com';
        await fetch(`${apiBase}/api/cart`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': user.id
          },
          body: JSON.stringify({
            productId: id,
            size,
            quantity
          })
        });
      } catch (e) {
        console.error("Failed to update database cart quantity", e);
      }
    }
  };

  const clearCart = async () => {
    setCart([]);

    if (user) {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://milgan-backend.onrender.com';
        await fetch(`${apiBase}/api/cart`, {
          method: 'DELETE',
          headers: { 'x-user-id': user.id }
        });
      } catch (e) {
        console.error("Failed to clear database cart", e);
      }
    }
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.basePrice * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        setIsOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
