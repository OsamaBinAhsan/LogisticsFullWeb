'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface WishlistContextType {
  items: string[];
  wishlistItems: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem('auracommerce_wishlist');
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load wishlist from local storage', err);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('auracommerce_wishlist', JSON.stringify(items));
    }
  }, [items, isMounted]);

  const toggle = (id: string) => {
    setItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const has = (id: string) => items.includes(id);

  return (
    <WishlistContext.Provider value={{ items, wishlistItems: items, toggle, has }}>
      {children}
    </WishlistContext.Provider>
  );
}


export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
