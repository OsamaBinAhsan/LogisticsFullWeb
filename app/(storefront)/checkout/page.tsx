'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/context/cart-context';
import { CheckoutForm } from '@/components/storefront/checkout-form';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && cartItems.length === 0 && !orderSuccess) {
      router.push('/cart');
    }
  }, [mounted, cartItems.length, orderSuccess, router]);

  const handleCheckoutSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const payload = {
        customer: data,
        items: cartItems,
        total: data.finalTotal || cartTotal,
        shipping: data.freightFee || 0,
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        setOrderSuccess(result);
        clearCart();
      } else {
        alert(result.error || 'Failed to dispatch manifest');
      }
    } catch (err) {
      console.error(err);
      alert('Network error placing order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  if (orderSuccess) {
    return (
      <div className="max-w-[800px] mx-auto px-6 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mx-auto shadow-lg">
          <span className="material-symbols-outlined text-[40px]">task_alt</span>
        </div>
        <div className="space-y-2">
          <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold">
            Manifest Accepted by Aura-Mesh
          </span>
          <h1 className="font-headline text-3xl sm:text-4xl font-bold text-on-surface">
            Consignment Dispatched Successfully!
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant max-w-lg mx-auto">
            Your items have been allocated and routed to the sorting conveyor line. A live telemetry link has been transmitted via SMS.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/40 text-left max-w-md mx-auto space-y-3 font-body-sm text-xs">
          <div className="flex justify-between border-b border-outline-variant/30 pb-2">
            <span className="text-outline">Invoice Code</span>
            <span className="font-mono font-bold text-on-surface">{orderSuccess.invoiceNumber || 'INV-2026-8841'}</span>
          </div>
          <div className="flex justify-between border-b border-outline-variant/30 pb-2">
            <span className="text-outline">Live Waybill ID</span>
            <span className="font-mono font-bold text-primary">#AC-9821-NYC</span>
          </div>
          <div className="flex justify-between">
            <span className="text-outline">Predicted Departure</span>
            <span className="font-mono font-bold text-secondary">Within 15 Minutes</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            href="/tracker"
            className="px-8 py-3.5 rounded-full bg-primary text-on-primary font-bold text-xs uppercase tracking-wider hover:bg-primary-container transition-all shadow-md flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">radar</span>
            Open Live Flight Radar
          </Link>
          <Link
            href="/products"
            className="px-8 py-3.5 rounded-full bg-surface-container-high text-on-surface font-bold text-xs uppercase tracking-wider hover:bg-surface-container-highest transition-all"
          >
            Return to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-10 min-h-screen">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="w-10 h-10 rounded-full bg-surface-container-low border border-outline-variant/40 flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold">
                Secure Telemetry Check
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary-fixed" />
              <span className="font-label-sm text-xs text-on-surface-variant font-medium">
                Session #AC-99420-X
              </span>
            </div>
            <p className="font-headline text-2xl font-bold text-on-surface tracking-tight">
              Express Checkout & Logistics Manifest
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant font-label-md text-xs border border-outline-variant/40">
            <span className="material-symbols-outlined text-primary text-[16px]">verified_user</span>
            <span>256-Bit Quantum TLS Secured</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-container/60 text-on-secondary-container font-label-md text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span>Hub Priority Reserved (14:48)</span>
          </div>
        </div>
      </div>

      {/* Main Form & Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7">
          <CheckoutForm onSubmit={handleCheckoutSubmit} isSubmitting={isSubmitting} />
        </div>

        {/* Right Column: Order Manifest Summary */}
        <div className="lg:col-span-5">
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border border-outline-variant/40 shadow-card sticky top-28 space-y-6">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
              <h3 className="font-headline text-lg font-bold text-on-surface">Order Manifest</h3>
              <span className="font-label-sm text-xs text-outline font-bold">
                {cartItems.length} Parcel Component{cartItems.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* Staged Items List */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.variantId}`}
                  className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-surface-container-low border border-outline-variant/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl bg-surface-container-high overflow-hidden shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-headline text-xs font-bold text-on-surface line-clamp-1">
                        {item.name}
                      </h4>
                      <span className="font-mono text-[10px] text-outline">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-headline text-xs font-bold text-primary font-mono">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Transparent Cost Breakdown */}
            <div className="space-y-2.5 pt-2 border-t border-outline-variant/30 font-body-sm text-xs">
              <div className="flex justify-between text-on-surface-variant">
                <span>Freight Subtotal</span>
                <span className="font-mono font-bold text-on-surface">৳{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Ground & Air Relay</span>
                <span className="font-mono font-bold text-secondary">Calculated at Step 2</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Tamper-Evident Packaging</span>
                <span className="font-mono font-bold text-on-surface">Included / Calibrated</span>
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant/30 flex justify-between items-baseline">
              <span className="font-headline text-base font-bold text-on-surface">Estimated Manifest</span>
              <span className="font-headline text-2xl font-bold text-primary">
                ৳{cartTotal.toLocaleString()}
              </span>
            </div>

            {/* Security Guarantee Box */}
            <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30 flex items-center gap-3 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-[24px] shrink-0">shield</span>
              <p className="leading-tight">
                All consignments covered under ISO-9002 autonomous courier transit guarantee.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
