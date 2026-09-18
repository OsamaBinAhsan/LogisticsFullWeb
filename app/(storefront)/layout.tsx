'use client';

import Link from 'next/link';
import { Search, Heart, ShoppingCart, CreditCard } from 'lucide-react';
import { useCart } from '@/lib/context/cart-context';
import { useWishlist } from '@/lib/context/wishlist-context';
import { CartDrawer } from '@/components/storefront/cart-drawer';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const { cartItems, openDrawer } = useCart();
  const { wishlistItems } = useWishlist();

  const cartCount = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const wishlistCount = wishlistItems?.length || 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Announcement Bar */}
      <div className="bg-[#14B8A6] text-black text-xs font-medium py-2 px-4 text-center">
        🚀 Free shipping on orders over ৳2000 | Same-day dispatch for Dhaka orders
      </div>

      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 bg-[#06080A]/80 backdrop-blur-xl border-b border-[#1E293B]/70">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold tracking-tighter text-white">
              Aura<span className="text-[#14B8A6]">Commerce</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-300">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/products" className="hover:text-white transition-colors">Products</Link>
              <Link href="/collections" className="hover:text-white transition-colors">Collections</Link>
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 bg-zinc-900/50 border border-zinc-800 rounded-md hover:bg-zinc-800/50 transition-colors">
              <Search className="w-4 h-4" />
              <span>Search...</span>
              <kbd className="hidden lg:inline-block ml-2 px-1.5 py-0.5 text-[10px] bg-zinc-800 rounded">
                /
              </kbd>
            </button>
            <Link href="/wishlist" className="relative p-2 text-zinc-400 hover:text-white transition-colors">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold bg-[#14B8A6] text-black rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button onClick={openDrawer} className="relative p-2 text-zinc-400 hover:text-white transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold bg-[#14B8A6] text-black rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Footer */}
      <footer className="border-t border-[#1E293B]/70 bg-[#0E121B]/85 mt-20">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Link href="/" className="text-xl font-bold tracking-tighter text-white">
                Aura<span className="text-[#14B8A6]">Commerce</span>
              </Link>
              <p className="text-sm text-zinc-400">
                Premium multi-channel e-commerce platform for modern brands.
              </p>
              <div className="flex items-center gap-4 pt-4">
                <CreditCard className="w-6 h-6 text-zinc-500" />
                <span className="text-zinc-500 font-mono text-sm">SECURE PAYMENTS</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Shop</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
                <li><Link href="/collections/new" className="hover:text-white transition-colors">New Arrivals</Link></li>
                <li><Link href="/collections/bestsellers" className="hover:text-white transition-colors">Bestsellers</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Newsletter</h3>
              <p className="text-sm text-zinc-400 mb-4">
                Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
              </p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-[#06080A] border border-[#1E293B]/70 rounded-md px-3 py-2 text-sm flex-1 text-white focus:outline-none focus:border-[#14B8A6]"
                />
                <button type="submit" className="bg-[#14B8A6] text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-[#14B8A6]/90 transition-colors">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-[#1E293B]/70 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
            <p>© {new Date().getFullYear()} AuraCommerce. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
