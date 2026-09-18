'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { CartItem } from '@/types';

interface CartContextType {
  items: CartItem[];
  cartItems: CartItem[];
  addItem: (itemOrProduct: any, variantId?: string) => void;
  removeItem: (productId: string, variantId?: string) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  cartTotal: number;
  itemCount: number;
  discount: number;
  couponCode?: string;
  applyCoupon: (code: string) => { success: boolean; message: string };
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string | undefined>(undefined);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem('auracommerce_cart');
      if (stored) {
        setItems(JSON.parse(stored));
      }
      const storedCoupon = localStorage.getItem('auracommerce_coupon');
      if (storedCoupon) {
        setCouponCode(storedCoupon);
      }
    } catch (err) {
      console.error('Failed to load cart from local storage', err);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('auracommerce_cart', JSON.stringify(items));
    }
  }, [items, isMounted]);

  useEffect(() => {
    if (isMounted) {
      if (couponCode) {
        localStorage.setItem('auracommerce_coupon', couponCode);
      } else {
        localStorage.removeItem('auracommerce_coupon');
      }
    }
  }, [couponCode, isMounted]);

  const addItem = (itemOrProduct: any, variantId?: string) => {
    let item: CartItem;
    if (itemOrProduct.productId && itemOrProduct.variantId) {
      item = {
        ...itemOrProduct,
        id: itemOrProduct.id || itemOrProduct.productId,
      };
    } else {
      const product = itemOrProduct;
      const v = product.variants?.find((va: any) => va.id === variantId) || product.variants?.[0];
      item = {
        id: product.id,
        productId: product.id,
        variantId: v ? v.id : `${product.id}-default`,
        name: product.name,
        slug: product.slug,
        image: product.images?.[0] || '/images/placeholder.jpg',
        price: v ? v.price : product.basePrice,
        quantity: 1,
        sku: v ? v.sku : product.id,
        variantName: v ? [v.size, v.color].filter(Boolean).join(' / ') : undefined,
      };
    }

    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          (i.productId === item.productId || i.id === item.productId) &&
          i.variantId === item.variantId
      );
      if (existing) {
        return prev.map((i) =>
          (i.productId === item.productId || i.id === item.productId) &&
          i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
    setIsDrawerOpen(true);
  };

  const removeItem = (productId: string, variantId?: string) => {
    setItems((prev) =>
      prev.filter((i) => {
        const matchesProduct = i.productId === productId || i.id === productId;
        if (!matchesProduct) return true;
        return variantId ? i.variantId !== variantId : false;
      })
    );
  };


  const updateQuantity = (productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, variantId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.variantId === variantId ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode(undefined);
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [items]);

  const itemCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const discount = useMemo(() => {
    if (!couponCode) return 0;
    if (couponCode === 'AURA10') return subtotal * 0.1;
    if (couponCode === 'FREESHIP') return 0; // Handled at checkout level
    return 0;
  }, [couponCode, subtotal]);

  const applyCoupon = (code: string) => {
    const validCodes = ['AURA10', 'FREESHIP'];
    if (validCodes.includes(code.toUpperCase())) {
      setCouponCode(code.toUpperCase());
      return { success: true, message: 'Coupon applied successfully.' };
    }
    setCouponCode(undefined);
    return { success: false, message: 'Invalid coupon code.' };
  };

  return (
    <CartContext.Provider
      value={{
        items,
        cartItems: items,
        addItem,
        removeItem,
        removeFromCart: removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        cartTotal: subtotal,
        itemCount,
        discount,
        couponCode,
        applyCoupon,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
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
