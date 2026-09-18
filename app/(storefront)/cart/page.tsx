'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/context/cart-context';

export default function CartPage() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  const shipping = cartTotal > 2000 ? 0 : 100;
  const total = cartTotal + shipping;
  const freeShippingProgress = Math.min((cartTotal / 2000) * 100, 100);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-24 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-24 h-24 bg-surface-container-low rounded-3xl flex items-center justify-center border border-outline-variant/40 shadow-sm">
          <span className="material-symbols-outlined text-[40px] text-outline">shopping_bag</span>
        </div>
        <h1 className="font-headline text-3xl font-bold text-on-surface">Your Dispatch Manifest is Empty</h1>
        <p className="font-body-md text-sm text-on-surface-variant max-w-md">
          Explore the curated freight catalog, IoT beacons, and modular gear to reserve items for immediate dispatch.
        </p>
        <Link
          href="/products"
          className="px-8 py-3.5 rounded-full bg-primary text-on-primary font-bold text-xs uppercase tracking-wider hover:bg-primary-container transition-all shadow-md"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse" />
            <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold">
              Dispatch Reservation
            </span>
          </div>
          <h1 className="font-headline text-3xl font-bold text-on-surface">Shopping Bag & Manifest</h1>
        </div>
        <span className="font-mono text-xs text-outline font-bold">
          {cartItems.length} SKU{cartItems.length > 1 ? 's' : ''} Staged
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/40 shadow-sm overflow-hidden">
            <div className="divide-y divide-outline-variant/30">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.variantId}`}
                  className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 bg-surface-container-low rounded-2xl overflow-hidden shrink-0 border border-outline-variant/40">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-headline font-bold text-base text-on-surface hover:text-primary transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      {item.variantName && (
                        <p className="font-mono text-xs text-outline mt-0.5">Spec: {item.variantName}</p>
                      )}
                      <p className="font-headline font-bold text-sm text-primary mt-1">
                        ৳{item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 self-end sm:self-center">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant/40 rounded-full p-1">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.productId || item.id || '', item.variantId, Math.max(1, item.quantity - 1))
                        }
                        className="w-7 h-7 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-headline text-xs font-bold text-on-surface">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.productId || item.id || '', item.variantId, item.quantity + 1)
                        }
                        className="w-7 h-7 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="font-headline font-bold text-base text-on-surface font-mono min-w-[80px] text-right">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.productId || item.id || '', item.variantId)}
                      className="p-2 text-outline hover:text-error transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coupon Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter Promo or Waybill Pass..."
              className="px-4 py-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary flex-1 max-w-sm"
            />
            <button
              type="button"
              className="px-6 py-3 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Apply Pass
            </button>
          </div>
        </div>

        {/* Right Column: Manifest Summary */}
        <div className="lg:col-span-4">
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border border-outline-variant/40 shadow-card sticky top-28 space-y-6">
            <h2 className="font-headline text-xl font-bold text-on-surface border-b border-outline-variant/30 pb-4">
              Dispatch Summary
            </h2>

            <div className="space-y-3 font-body-sm text-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>Freight Subtotal</span>
                <span className="font-mono font-bold text-on-surface">৳{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Relay Shipping</span>
                <span className="font-mono font-bold text-secondary">
                  {shipping === 0 ? 'FREE (Threshold)' : `৳${shipping}`}
                </span>
              </div>
            </div>

            {/* Free Shipping Progress */}
            <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-on-surface-variant">Free Dispatch Progress</span>
                <span className="text-primary font-mono">{freeShippingProgress.toFixed(0)}%</span>
              </div>
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 rounded-full"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
              {freeShippingProgress < 100 ? (
                <p className="text-[11px] text-outline">
                  Add <strong className="text-on-surface">৳{(2000 - cartTotal).toLocaleString()}</strong> more to unlock zero-fee air dispatch.
                </p>
              ) : (
                <p className="text-[11px] text-secondary font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span> Free expedited dispatch unlocked!
                </p>
              )}
            </div>

            <div className="border-t border-outline-variant/30 pt-4 flex justify-between items-baseline">
              <span className="font-headline text-base font-bold text-on-surface">Manifest Total</span>
              <span className="font-headline text-3xl font-bold text-primary">৳{total.toLocaleString()}</span>
            </div>

            <button
              type="button"
              onClick={() => router.push('/checkout')}
              className="w-full py-4 rounded-full bg-primary text-on-primary font-bold text-xs uppercase tracking-wider hover:bg-primary-container active:scale-98 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              Proceed to Express Checkout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
