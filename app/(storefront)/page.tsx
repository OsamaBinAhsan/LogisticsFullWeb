'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { ProductCard } from '@/components/storefront/product-card';
import { HeroVisualizer } from '@/components/storefront/hero-visualizer';
import type { Product } from '@/types';

export default function StorefrontPage() {
  const [trackingId, setTrackingId] = React.useState('AC-88942-X');
  const [selectedVelocity, setSelectedVelocity] = React.useState(1);
  const [progressWidth, setProgressWidth] = React.useState(68);
  const [eta, setEta] = React.useState('1h 42m');
  const [route, setRoute] = React.useState('NRT (Tokyo) ➔ LAX (Terminal 4)');
  const [carrier, setCarrier] = React.useState('AIR EXPRESS • MACH 0.82');
  const [toastMsg, setToastMsg] = React.useState<string | null>(null);

  const [products, setProducts] = React.useState<Product[]>([]);

  React.useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data.slice(0, 8));
      })
      .catch(() => {});
  }, []);

  const triggerTelemetryScan = (id?: string) => {
    const target = id || trackingId;
    if (target.toUpperCase().includes('JP') || target.toUpperCase().includes('DRN')) {
      setRoute('HND (Tokyo) ➔ SFO (Rooftop Bay 2)');
      setCarrier('AUTONOMOUS DRONE • SUB-ORBITAL');
      setEta('38m');
      setProgressWidth(84);
    } else if (target.toUpperCase().includes('BER')) {
      setRoute('BER (Berlin) ➔ LHR (Terminal 5)');
      setCarrier('HYPER-RAIL CORRIDOR • ZERO EMISSION');
      setEta('3h 10m');
      setProgressWidth(45);
    } else {
      setRoute('NRT (Tokyo) ➔ LAX (Terminal 4)');
      setCarrier('AIR EXPRESS • MACH 0.82');
      setEta('1h 42m');
      setProgressWidth(68);
    }
    showToast(`Telemetry locked on ${target}`);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-surface">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-24 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-7 h-7 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[18px]">check</span>
          </div>
          <div>
            <p className="font-label-lg text-xs font-bold leading-tight">Manifest Synchronized</p>
            <p className="font-body-sm text-xs text-inverse-on-surface/80">{toastMsg}</p>
          </div>
        </div>
      )}

      {/* HERO SECTION: Kinetic Fluid Logistics Grid */}
      <section className="relative w-full overflow-hidden pb-16 pt-6 lg:pt-10">
        {/* Ambient Luminous Gradient Underlay */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[980px] h-[480px] bg-gradient-to-b from-primary/10 via-secondary-container/15 to-transparent blur-3xl pointer-events-none rounded-full -z-10" />

        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          {/* Breadcrumb / Telemetry Overline */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="font-label-sm text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                Aura Global Mesh v4.8
              </span>
              <span className="font-body-sm text-outline-variant">•</span>
              <span className="font-label-sm text-xs text-primary font-bold">
                Tokyo ⇄ Frankfurt ⇄ JFK Transit Active
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-on-surface-variant font-body-sm text-xs">
              <span>Telemetry Ping: <strong className="text-on-surface">18ms</strong></span>
              <span>Network Saturation: <strong className="text-secondary">Optimal (42%)</strong></span>
            </div>
          </div>

          {/* Main Asymmetric Hero Bento */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Cols: Typography, Interactive Waybill Interceptor & Velocity Switcher */}
            <div className="lg:col-span-7 flex flex-col space-y-6">
              <div className="space-y-4">
                <span className="font-label-lg text-xs uppercase tracking-widest text-primary font-bold">
                  Autonomous Supply Choreography
                </span>
                <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl text-on-surface font-bold tracking-tight leading-[1.08] max-w-2xl">
                  Logistics made fluid. <br />
                  <span className="text-primary underline decoration-secondary-container decoration-4 underline-offset-4">
                    Commerce without friction.
                  </span>
                </h1>
                <p className="font-body-lg text-base lg:text-lg text-on-surface-variant max-w-xl">
                  AuraCommerce merges supersonic freight orchestration with hyper-responsive modular retail. Direct from robotic packaging hubs to your doorstep within hours.
                </p>
              </div>

              {/* Dynamic Live Interactive Tracking Search with Instant Preview */}
              <div className="w-full bg-surface-container-lowest p-5 rounded-2xl shadow-card border border-outline-variant/40 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5 font-bold">
                    <span className="material-symbols-outlined text-primary text-[18px]">radar</span>
                    Live Flight / Waybill Interceptor
                  </label>
                  <span className="font-label-sm text-xs text-outline">
                    Try:{' '}
                    <button
                      type="button"
                      className="text-primary font-bold hover:underline"
                      onClick={() => {
                        setTrackingId('AC-88942-X');
                        triggerTelemetryScan('AC-88942-X');
                      }}
                    >
                      AC-88942-X
                    </button>
                    {' or '}
                    <button
                      type="button"
                      className="text-primary font-bold hover:underline"
                      onClick={() => {
                        setTrackingId('JP-9011-DRN');
                        triggerTelemetryScan('JP-9011-DRN');
                      }}
                    >
                      JP-9011-DRN
                    </button>
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                      qr_code_scanner
                    </span>
                    <input
                      type="text"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      placeholder="Enter Manifest or Waybill ID..."
                      className="w-full pl-11 pr-4 py-3 bg-surface-container-low rounded-xl font-headline text-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all uppercase tracking-wider"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => triggerTelemetryScan()}
                    className="px-6 py-3 rounded-xl bg-primary text-on-primary font-label-lg text-xs tracking-wide hover:bg-primary-container active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm font-bold"
                  >
                    <span className="material-symbols-outlined text-[18px]">my_location</span>
                    Ping Orbit
                  </button>
                </div>

                {/* Instant Live Waybill Card Preview */}
                <div className="bg-surface-container-low p-4 rounded-xl space-y-3 transition-all border border-outline-variant/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[10px] font-bold">
                        {carrier}
                      </span>
                      <span className="font-label-md text-xs text-on-surface font-bold">
                        {route}
                      </span>
                    </div>
                    <span className="font-label-sm text-xs font-bold text-secondary flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" />
                      ETA: {eta}
                    </span>
                  </div>

                  {/* Transit Progress Bar with Animated Dots */}
                  <div className="relative w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-700 relative rounded-full"
                      style={{ width: `${progressWidth}%` }}
                    >
                      <div className="absolute right-0 top-0 bottom-0 w-2 bg-secondary-fixed animate-pulse" />
                    </div>
                  </div>

                  {/* Micro GPS Sensor Milestones */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center font-label-sm text-[11px]">
                    <div className="text-left">
                      <p className="text-outline">Cleared Customs</p>
                      <p className="font-bold text-on-surface">Narita Hub #4</p>
                    </div>
                    <div>
                      <p className="text-primary font-bold">Trans-Pacific Arc</p>
                      <p className="text-on-surface-variant font-medium">Altitude 38,000ft</p>
                    </div>
                    <div className="text-right">
                      <p className="text-outline">Destination Hub</p>
                      <p className="font-bold text-on-surface">Los Angeles Center</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Playful Velocity Tier Selector */}
              <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-label-lg text-sm font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">bolt</span>
                    Dispatch Velocity Calibration
                  </p>
                  <span className="font-label-sm text-xs text-on-surface-variant">
                    Instant route re-calculation
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { tier: 'Standard Eco', fee: 'FREE', time: '3 Days', desc: 'Ground freight & rail line' },
                    { tier: 'Aura HyperSpeed', fee: '+$14.00', time: 'Next Morning', desc: 'Direct air charter hop' },
                    { tier: 'Autonomous Drone', fee: '+$29.00', time: '2 Hours', desc: 'Skyport rooftop tether' },
                  ].map((item, idx) => {
                    const isSelected = selectedVelocity === idx;
                    return (
                      <button
                        key={item.tier}
                        type="button"
                        onClick={() => {
                          setSelectedVelocity(idx);
                          showToast(`Calibrated velocity: ${item.tier}`);
                        }}
                        className={`p-3.5 rounded-xl text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-surface-container-lowest border-2 border-primary shadow-sm'
                            : 'bg-surface-container hover:bg-surface-container-lowest border border-transparent'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className={`font-label-sm text-xs uppercase font-bold ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                            {item.tier}
                          </span>
                          <span className="font-label-sm text-xs font-bold text-secondary">
                            {item.fee}
                          </span>
                        </div>
                        <p className="font-headline text-lg font-bold text-on-surface">{item.time}</p>
                        <p className="font-body-sm text-[11px] text-on-surface-variant mt-1">{item.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right 5 Cols: 3D Holographic Spatial Parcel Card */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center pt-2">
              <HeroVisualizer
                waybillId={trackingId}
                destination={route}
                weight={selectedVelocity === 2 ? '0.85 kg (Drone Spec)' : '1.84 kg'}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hardware Catalog Showcase */}
      <section className="w-full py-16 px-6 lg:px-12 bg-surface-container-low/50 border-y border-surface-container-high">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse" />
                <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold">
                  Curated Catalog Drops
                </span>
              </div>
              <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface">
                Featured Freight Hardware & Gear
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 font-label-md text-sm text-primary font-bold hover:underline"
            >
              View All 148 Depots <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Supersonic Freight Corridors Section */}
      <section className="w-full py-20 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="bg-inverse-surface text-inverse-on-surface rounded-3xl p-8 lg:p-12 shadow-xl relative overflow-hidden">
            {/* Subtle Tactical Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#b4c5ff_1px,transparent_1px)] [background-size:24px_24px]" />

            <div className="relative z-10 space-y-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed animate-ping" />
                    <span className="font-label-sm text-xs uppercase tracking-widest text-primary-fixed-dim font-bold">
                      Orbital Corridors & Cargo Radar
                    </span>
                  </div>
                  <h2 className="font-headline text-3xl font-bold text-white mt-1">
                    Live Transcontinental Flight Vectors
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-3.5 py-1.5 rounded-full bg-surface-variant/20 text-xs font-mono text-inverse-on-surface">
                    Mach 0.82 Cruising
                  </div>
                  <Link
                    href="/tracker"
                    className="px-5 py-2 rounded-full bg-primary-container hover:bg-primary text-white font-label-md text-xs font-bold transition-all"
                  >
                    Open Live Tracker
                  </Link>
                </div>
              </div>

              {/* Corridor Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-surface-variant/10 border border-surface-variant/20 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs text-primary-fixed font-bold">CORRIDOR 01</span>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                      ACTIVE
                    </span>
                  </div>
                  <h3 className="font-headline text-xl font-bold text-white">Trans-Pacific Arc</h3>
                  <p className="font-body-sm text-xs text-inverse-on-surface/70">
                    Tokyo Narita (NRT) ➔ Los Angeles (LAX). Supersonic cargo charter flight path.
                  </p>
                  <div className="pt-2 border-t border-surface-variant/20 flex justify-between text-xs font-mono">
                    <span className="text-inverse-on-surface/60">Avg Transit</span>
                    <span className="text-secondary-fixed font-bold">8h 12m</span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-surface-variant/10 border border-surface-variant/20 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs text-primary-fixed font-bold">CORRIDOR 02</span>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                      ACTIVE
                    </span>
                  </div>
                  <h3 className="font-headline text-xl font-bold text-white">Trans-Atlantic Express</h3>
                  <p className="font-body-sm text-xs text-inverse-on-surface/70">
                    Frankfurt Terminal (FRA) ➔ New York JFK. Continuous sub-day customs pre-clearance.
                  </p>
                  <div className="pt-2 border-t border-surface-variant/20 flex justify-between text-xs font-mono">
                    <span className="text-inverse-on-surface/60">Avg Transit</span>
                    <span className="text-secondary-fixed font-bold">7h 28m</span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-surface-variant/10 border border-surface-variant/20 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs text-primary-fixed font-bold">CORRIDOR 03</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary text-[10px] font-bold">
                      HYPER-RAIL
                    </span>
                  </div>
                  <h3 className="font-headline text-xl font-bold text-white">Eurasian Silk Network</h3>
                  <p className="font-body-sm text-xs text-inverse-on-surface/70">
                    Shanghai Hub ➔ Berlin Central Hub. Zero-emission high-speed magnetic transit.
                  </p>
                  <div className="pt-2 border-t border-surface-variant/20 flex justify-between text-xs font-mono">
                    <span className="text-inverse-on-surface/60">Avg Transit</span>
                    <span className="text-secondary-fixed font-bold">48h 00m</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Express WhatsApp & API CTA Section */}
      <section className="w-full pb-20 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto bg-surface-container-low rounded-3xl p-8 lg:p-12 border border-outline-variant/40 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold">
              Multi-Channel Direct Integration
            </span>
            <h2 className="font-headline text-3xl font-bold text-on-surface">
              Prefer Instant WhatsApp or Terminal Ordering?
            </h2>
            <p className="font-body-md text-sm text-on-surface-variant">
              Skip traditional checkouts. Our automated booking bot dispatches parcels directly to courier sorting lines with zero typing.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <a
              href="https://wa.me/8801234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#22C55E] text-white font-bold text-sm shadow-md hover:bg-[#1fa94c] transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Express Bot
            </a>
            <Link
              href="/checkout"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-on-surface text-surface font-bold text-sm shadow-md hover:opacity-90 transition-all"
            >
              Checkout Demo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
