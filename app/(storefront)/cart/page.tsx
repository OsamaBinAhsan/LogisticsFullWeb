'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, Minus, Plus, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '@/lib/context/cart-context';

export default function CartPage() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  
  const shipping = cartTotal > 2000 ? 0 : 100;
  const total = cartTotal + shipping;
  const freeShippingProgress = Math.min((cartTotal / 2000) * 100, 100);

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-24 h-24 bg-[#0E121B] rounded-full flex items-center justify-center border border-[#1E293B]/70">
          <span className="text-4xl">🛒</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Your cart is empty</h1>
        <p className="text-zinc-400 max-w-md">
          Looks like you haven't added anything to your cart yet. Discover our premium collections and find something you love.
        </p>
        <Link 
          href="/products" 
          className="bg-[#14B8A6] text-black px-8 py-3 rounded-md font-semibold hover:bg-white transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Cart Items */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1E293B]/30 border-b border-[#1E293B]/70">
                    <th className="p-4 text-sm font-medium text-zinc-400 w-[50%]">Product</th>
                    <th className="p-4 text-sm font-medium text-zinc-400">Price</th>
                    <th className="p-4 text-sm font-medium text-zinc-400">Quantity</th>
                    <th className="p-4 text-sm font-medium text-zinc-400 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B]/70">
                  {cartItems.map((item) => (
                    <tr key={`${item.id}-${item.variantId}`}>
                      <td className="p-4">
                        <div className="flex gap-4 items-center">
                          <div className="relative w-20 h-20 bg-zinc-900 rounded-md overflow-hidden shrink-0 border border-[#1E293B]">
                            <Image 
                              src={item.image} 
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <Link href={`/products/${item.slug}`} className="font-semibold text-white hover:text-[#14B8A6] transition-colors line-clamp-2">
                              {item.name}
                            </Link>
                            {item.variantName && (
                              <p className="text-sm text-zinc-500 mt-1">Variant: {item.variantName}</p>
                            )}
                            <button 
                              onClick={() => removeFromCart(item.productId || item.id || '', item.variantId)}
                              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 mt-2 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" /> Remove
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-zinc-300 font-mono">
                        ৳{item.price.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 bg-[#06080A] border border-[#1E293B]/70 w-fit rounded-md p-1">
                          <button 
                            onClick={() => updateQuantity(item.productId || item.id || '', item.variantId, Math.max(1, item.quantity - 1))}
                            className="p-1 text-zinc-400 hover:text-white"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-white">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.productId || item.id || '', item.variantId, item.quantity + 1)}
                            className="p-1 text-zinc-400 hover:text-white"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                      </td>
                      <td className="p-4 text-right font-mono font-medium text-white">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Coupon Code" 
              className="bg-[#06080A] border border-[#1E293B]/70 rounded-md px-4 py-2 text-sm text-white focus:outline-none focus:border-[#14B8A6] w-full max-w-xs"
            />
            <button className="bg-[#1E293B]/50 border border-[#1E293B] text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-[#1E293B] transition-colors">
              Apply
            </button>
          </div>
        </div>

        {/* Right Column: Summary */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 sticky top-24 space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-[#1E293B]/70 pb-4">Order Summary</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-zinc-300">
                <span>Subtotal</span>
                <span className="font-mono">৳{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Shipping</span>
                <span className="font-mono">{shipping === 0 ? 'Free' : `৳${shipping}`}</span>
              </div>
            </div>

            <div className="border-t border-[#1E293B]/70 pt-4 flex justify-between items-end">
              <span className="text-white font-medium">Total</span>
              <span className="text-2xl font-bold text-[#14B8A6] font-mono">৳{total.toLocaleString()}</span>
            </div>

            <div className="bg-[#1E293B]/30 rounded-lg p-4 border border-[#1E293B]/50">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-zinc-400">Free Shipping Progress</span>
                <span className="text-[#14B8A6] font-medium">{freeShippingProgress.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#06080A] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#14B8A6] transition-all duration-500 ease-out" 
                  style={{ width: `${freeShippingProgress}%` }} 
                />
              </div>
              {freeShippingProgress < 100 ? (
                <p className="text-xs text-zinc-500 mt-2">
                  Add <span className="text-white">৳{(2000 - cartTotal).toLocaleString()}</span> more to unlock free shipping.
                </p>
              ) : (
                <p className="text-xs text-[#14B8A6] mt-2 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Free shipping unlocked!
                </p>
              )}
            </div>

            <button 
              onClick={() => router.push('/checkout')}
              className="w-full bg-[#14B8A6] text-black py-3.5 rounded-md font-semibold hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 group"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="pt-4 border-t border-[#1E293B]/70 flex justify-center gap-3 grayscale opacity-60">
              {/* Payment Icons placehoder */}
              <div className="w-8 h-5 bg-zinc-800 rounded"></div>
              <div className="w-8 h-5 bg-zinc-800 rounded"></div>
              <div className="w-8 h-5 bg-zinc-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
