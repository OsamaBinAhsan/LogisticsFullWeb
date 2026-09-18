'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useCart } from '@/lib/context/cart-context';
import { CheckoutForm } from '@/components/storefront/checkout-form';
import Image from 'next/image';

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

  const shipping = cartTotal > 2000 ? 0 : 100;
  const total = cartTotal + shipping;


  const handleCheckoutSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const payload = {
        customer: data,
        items: cartItems,
        total,
        shipping
      };
      
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await res.json();
      
      if (result.success) {
        setOrderSuccess(result);
        clearCart();
      } else {
        alert(result.error || 'Failed to place order');
      }
    } catch (err) {
      console.error(err);
      alert('Network error placing order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 bg-[#14B8A6]/20 text-[#14B8A6] rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-bold text-white">Order Confirmed!</h1>
        <p className="text-zinc-400 max-w-md text-lg">
          Thank you for your purchase. Your order <span className="font-mono text-white">#{orderSuccess.invoiceNumber}</span> has been received.
        </p>
        <button 
          onClick={() => router.push('/')}
          className="mt-8 bg-[#14B8A6] text-black px-8 py-3 rounded-md font-semibold hover:bg-white transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-24 text-center font-mono text-xs text-zinc-500">
        Loading Checkout Ledger...
      </div>
    );
  }

  if (cartItems.length === 0) {
    return null;
  }


  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="glass-card p-6 lg:p-8">
            <h1 className="text-2xl font-bold text-white mb-8 border-b border-[#1E293B]/70 pb-4">
              Checkout
            </h1>
            <CheckoutForm onSubmit={handleCheckoutSubmit} isSubmitting={isSubmitting} />
          </div>
        </div>

        {/* Right Column: Order Summary (Non-editable) */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="glass-card p-6 sticky top-24 bg-[#06080A]/80 border-[#1E293B]">
            <h2 className="text-lg font-bold text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.variantId}`} className="flex gap-4 items-start">
                  <div className="relative w-16 h-16 bg-zinc-900 rounded border border-[#1E293B] shrink-0 overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                    <span className="absolute -top-2 -right-2 bg-[#14B8A6] text-black w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold z-10 border border-[#06080A]">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.name}</p>
                    {item.variantName && <p className="text-xs text-zinc-500">{item.variantName}</p>}
                  </div>
                  <div className="text-sm font-mono text-zinc-300">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-[#1E293B]/70 text-sm">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span className="font-mono text-zinc-300">৳{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Shipping</span>
                <span className="font-mono text-zinc-300">{shipping === 0 ? 'Free' : `৳${shipping}`}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 mt-4 border-t border-[#1E293B]/70">
              <span className="font-semibold text-white">Total</span>
              <span className="text-2xl font-bold font-mono text-[#14B8A6]">
                ৳{total.toLocaleString()}
              </span>
            </div>
            
            {isSubmitting && (
              <div className="absolute inset-0 bg-[#06080A]/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
                <Loader2 className="w-8 h-8 text-[#14B8A6] animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
