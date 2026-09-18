'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/context/cart-context';
import { CartDrawer } from '@/components/storefront/cart-drawer';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const { cartItems, openDrawer } = useCart();
  const pathname = usePathname();

  const cartCount = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Catalog & Shop', href: '/products' },
    { label: 'Real-Time Tracker', href: '/tracker' },
    { label: 'Customer Reviews', href: '/reviews' },
    { label: 'Cart', href: '/cart' },
    { label: 'Checkout Demo', href: '/checkout' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      {/* Top Ambient Marquee Ticker */}
      <div className="w-full bg-inverse-surface text-inverse-on-surface overflow-hidden py-1.5 border-b border-inverse-surface/10 select-none">
        <div className="animate-marquee whitespace-nowrap">
          <div className="flex items-center gap-12 px-6">
            <span className="inline-flex items-center gap-2 font-label-md text-label-md tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-ping"></span>
              ⚡ Instant Global Freight & Next-Day Delivery across 140+ countries
            </span>
            <span className="text-inverse-on-surface/40">•</span>
            <span className="font-label-md text-label-md tracking-wider uppercase text-inverse-on-surface/90">
              Track with AI Precision
            </span>
            <span className="text-inverse-on-surface/40">•</span>
            <span className="font-label-md text-label-md tracking-wider uppercase text-inverse-on-surface/90">
              Free Dispatch on Orders over $150
            </span>
            <span className="text-inverse-on-surface/40">•</span>
            <span className="font-label-md text-label-md tracking-wider uppercase text-secondary-fixed">
              Live Radar Synchronized
            </span>
          </div>
          <div className="flex items-center gap-12 px-6">
            <span className="inline-flex items-center gap-2 font-label-md text-label-md tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-ping"></span>
              ⚡ Instant Global Freight & Next-Day Delivery across 140+ countries
            </span>
            <span className="text-inverse-on-surface/40">•</span>
            <span className="font-label-md text-label-md tracking-wider uppercase text-inverse-on-surface/90">
              Track with AI Precision
            </span>
            <span className="text-inverse-on-surface/40">•</span>
            <span className="font-label-md text-label-md tracking-wider uppercase text-inverse-on-surface/90">
              Free Dispatch on Orders over $150
            </span>
            <span className="text-inverse-on-surface/40">•</span>
            <span className="font-label-md text-label-md tracking-wider uppercase text-secondary-fixed">
              Live Radar Synchronized
            </span>
          </div>
        </div>
      </div>

      {/* Kinetic Frosted Header */}
      <header className="sticky top-0 z-50 bg-surface/85 backdrop-blur-xl border-b border-surface-container-high shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div className="h-20 max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-sm group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[20px]">radar</span>
              </div>
              <span className="font-headline text-2xl font-bold tracking-tight text-on-surface">
                Aura<span className="text-primary">Commerce</span>
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full font-label-sm text-[10px] bg-surface-container-high text-primary tracking-widest uppercase font-bold">
                Logistics OS
              </span>
            </Link>
          </div>

          {/* Desktop Nav Pills */}
          <nav className="hidden xl:flex items-center gap-1 p-1 bg-surface-container-low rounded-full">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-full font-label-md text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-container text-white font-bold shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Tools & Admin Link */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-highest hover:bg-surface-container-high transition-colors font-label-sm text-xs font-bold text-on-surface"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Admin OS
              <span className="px-1.5 py-0.2 rounded-full bg-secondary-container text-on-secondary-container font-bold text-[10px] tracking-tight">
                Live
              </span>
            </Link>

            {/* Quick Search */}
            <Link
              href="/products"
              className="hidden md:flex items-center justify-between gap-3 px-3.5 py-2 rounded-full bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low transition-colors shadow-[0_1px_4px_rgba(0,0,0,0.03)] group"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary transition-colors">
                  search
                </span>
                <span className="font-body-sm text-xs text-on-surface-variant/80">
                  Quick track or search...
                </span>
              </div>
              <kbd className="hidden lg:inline-flex items-center px-2 py-0.5 rounded-full font-label-sm text-[10px] bg-surface-container text-on-surface-variant/70">
                ⌘K
              </kbd>
            </Link>

            {/* Bag Button */}
            <button
              onClick={openDrawer}
              type="button"
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-surface-container-lowest hover:bg-surface-container-high transition-transform active:scale-95 duration-200 shadow-[0_1px_6px_rgba(0,0,0,0.04)]"
            >
              <span className="material-symbols-outlined text-[20px] text-on-surface">shopping_bag</span>
              <span className="hidden sm:inline font-label-md text-xs font-semibold text-on-surface">Bag</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary text-on-primary font-label-sm text-xs flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Page Body */}
      <main className="flex-1 w-full">{children}</main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Kinetic Footer */}
      <footer className="border-t border-surface-container-high bg-surface-container-low mt-24 py-16">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-on-primary">
                  <span className="material-symbols-outlined text-[18px]">radar</span>
                </div>
                <span className="font-headline text-xl font-bold tracking-tight text-on-surface">
                  Aura<span className="text-primary">Commerce</span>
                </span>
                <span className="px-2 py-0.5 rounded-full font-label-sm text-[10px] bg-secondary-container text-on-secondary-container font-bold">
                  Mesh v4.8
                </span>
              </div>
              <p className="font-body-md text-sm text-on-surface-variant max-w-md">
                Autonomous supply choreography meets modular luxury e-commerce. Sub-second GPS tracking, robotic fulfillment hubs, and verified freight telemetry across 140+ countries.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest text-xs font-bold text-on-surface shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-ping"></span>
                  14 Transcontinental Hubs Online
                </span>
              </div>
            </div>

            <div className="md:col-span-2 space-y-3">
              <h4 className="font-label-lg text-xs font-bold uppercase tracking-wider text-outline">
                Navigation
              </h4>
              <ul className="space-y-2 font-body-sm text-sm text-on-surface-variant">
                <li><Link href="/" className="hover:text-primary transition-colors">Home Page</Link></li>
                <li><Link href="/products" className="hover:text-primary transition-colors">Catalog & Shop</Link></li>
                <li><Link href="/tracker" className="hover:text-primary transition-colors">Real-Time Tracker</Link></li>
                <li><Link href="/reviews" className="hover:text-primary transition-colors">Field Telemetry</Link></li>
              </ul>
            </div>

            <div className="md:col-span-2 space-y-3">
              <h4 className="font-label-lg text-xs font-bold uppercase tracking-wider text-outline">
                Operations
              </h4>
              <ul className="space-y-2 font-body-sm text-sm text-on-surface-variant">
                <li><Link href="/admin" className="hover:text-primary transition-colors">AuraOS Admin</Link></li>
                <li><Link href="/admin/orders" className="hover:text-primary transition-colors">Shipment Orders</Link></li>
                <li><Link href="/admin/logistics/dispatch" className="hover:text-primary transition-colors">Dispatch Matrix</Link></li>
                <li><Link href="/admin/logistics/labels/print" className="hover:text-primary transition-colors">Thermal 4×6 Labels</Link></li>
              </ul>
            </div>

            <div className="md:col-span-3 space-y-3">
              <h4 className="font-label-lg text-xs font-bold uppercase tracking-wider text-outline">
                Telemetry Push
              </h4>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Receive live orbital freight telemetry and batch restock manifests directly to your terminal.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="operator@network.io"
                  className="px-3.5 py-2 text-sm rounded-xl bg-surface-container-lowest border border-outline-variant/50 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary flex-1"
                />
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-colors"
                >
                  Join
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-surface-container-high flex flex-col sm:flex-row items-center justify-between gap-4 font-body-sm text-xs text-on-surface-variant">
            <p>© {new Date().getFullYear()} AuraCommerce Logistics OS. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1 text-secondary font-bold">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                256-Bit Quantum TLS Secured
              </span>
              <span className="text-outline">•</span>
              <span>IATA Certified</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
