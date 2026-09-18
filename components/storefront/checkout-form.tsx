"use client";

import * as React from "react";
import { useCart } from "@/lib/context/cart-context";
import { CurrencyFormatter } from "@/components/shared/currency-formatter";
import confetti from "canvas-confetti";
import { Loader2 } from "lucide-react";

interface CheckoutFormProps {
  onSubmit?: (data: any) => Promise<void> | void;
  isSubmitting?: boolean;
}

export function CheckoutForm({
  onSubmit,
  isSubmitting: externalSubmitting = false,
}: CheckoutFormProps = {}) {
  const { cartItems, cartTotal } = useCart();

  const [formData, setFormData] = React.useState({
    name: "Elena Rostova",
    phone: "+1 (415) 890-2104",
    street: "742 Evergreen Terrace, Skyway District",
    city: "San Francisco",
    postalCode: "94107",
    country: "United States (West Hub)",
    paymentMethod: "cod",
    velocityTier: 1, // 0: eco, 1: hyperspeed, 2: drone
    packaging: "kevlar",
    insurance: true,
  });

  const [internalSubmitting, setInternalSubmitting] = React.useState(false);
  const isSubmitting = externalSubmitting || internalSubmitting;

  const velocityFees = [0, 140, 290];
  const packagingFees: Record<string, number> = { carbon: 0, kevlar: 45 };
  const insuranceFee = formData.insurance ? 35 : 0;

  const freightFee = velocityFees[formData.velocityTier];
  const packFee = packagingFees[formData.packaging] || 0;
  const finalTotal = cartTotal + freightFee + packFee + insuranceFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInternalSubmitting(true);

    try {
      if (typeof window !== "undefined") {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#2563eb", "#b2f746", "#004ac6"],
        });
      }

      if (onSubmit) {
        await onSubmit({
          ...formData,
          freightFee,
          packFee,
          insuranceFee,
          finalTotal,
        });
      }
    } finally {
      setInternalSubmitting(false);
    }
  };

  return (
    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
      {/* 1-Click Instant Dispatch */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/40">
        <div className="flex items-center justify-between mb-4">
          <span className="font-label-lg text-xs uppercase tracking-wider text-on-surface font-bold">
            Instant 1-Click Dispatch
          </span>
          <span className="font-label-sm text-xs text-on-surface-variant">Zero typing needed</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            className="group flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-surface-container-low hover:bg-on-surface hover:text-white text-on-surface transition-all duration-200 shadow-sm active:scale-95"
          >
            <span className="font-headline text-base leading-none font-bold"></span>
            <span className="font-label-lg text-xs font-bold">Pay</span>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="group flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface transition-all duration-200 shadow-sm active:scale-95"
          >
            <span className="font-headline text-base font-bold text-primary leading-none">G</span>
            <span className="font-label-lg text-xs font-bold">Pay</span>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="group flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-secondary-container text-on-secondary-container hover:brightness-95 transition-all duration-200 shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            <span className="font-label-lg text-xs font-bold">Aura Credit</span>
          </button>
        </div>
        <div className="relative flex py-4 items-center">
          <div className="flex-grow h-px bg-surface-container-high" />
          <span className="flex-shrink mx-4 font-label-sm text-xs uppercase text-outline tracking-wider font-bold">
            Or verify manual manifest
          </span>
          <div className="flex-grow h-px bg-surface-container-high" />
        </div>
      </div>

      {/* Step 1: Destination */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/40">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-md text-xs font-bold">
              1
            </div>
            <div>
              <h2 className="font-headline text-base text-on-surface font-bold leading-tight">
                Shipping Destination
              </h2>
              <p className="font-body-sm text-xs text-on-surface-variant">Global geocoded precision down to loading bay</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 font-label-sm text-xs text-secondary font-bold px-2.5 py-0.5 rounded-full bg-secondary-container/50">
            <span className="material-symbols-outlined text-[14px]">my_location</span>
            GPS Match 100%
          </span>
        </div>

        <div className="space-y-4 font-body-sm text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block uppercase text-on-surface-variant mb-1 font-bold">Full Recipient Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/40 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div>
              <label className="block uppercase text-on-surface-variant mb-1 font-bold">Contact Channel (SMS Dispatch)</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/40 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block uppercase text-on-surface-variant mb-1 font-bold">Street Coordinates & Suite</label>
            <div className="relative">
              <input
                type="text"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="w-full px-4 py-2.5 pr-10 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/40 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary text-sm"
              />
              <span className="material-symbols-outlined text-primary text-[20px] absolute right-3 top-2.5 pointer-events-none">
                check_circle
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block uppercase text-on-surface-variant mb-1 font-bold">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div>
              <label className="block uppercase text-on-surface-variant mb-1 font-bold">Postal Code</label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div>
              <label className="block uppercase text-on-surface-variant mb-1 font-bold">Country Hub</label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
              >
                <option value="United States (West Hub)">United States (West Hub)</option>
                <option value="Germany (Berlin Freight)">Germany (Berlin Freight)</option>
                <option value="Japan (Tokyo Port Hub)">Japan (Tokyo Port Hub)</option>
                <option value="Bangladesh (Dhaka Terminal)">Bangladesh (Dhaka Terminal)</option>
              </select>
            </div>
          </div>

          <div className="mt-2 rounded-xl bg-surface-container-low p-3 flex items-center justify-between border border-outline-variant/30">
            <div className="flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-primary text-[20px]">pin_drop</span>
              <span className="font-body-sm text-xs">Rooftop / Balcony Landing Pad verified for autonomous drop</span>
            </div>
            <span className="font-label-sm text-xs text-secondary font-bold uppercase">Ready</span>
          </div>
        </div>
      </div>

      {/* Step 2: Velocity Calibration */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/40">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-md text-xs font-bold">
              2
            </div>
            <div>
              <h2 className="font-headline text-base text-on-surface font-bold leading-tight">
                Delivery Velocity & SLA
              </h2>
              <p className="font-body-sm text-xs text-on-surface-variant">Choose speed calibration per dispatch requirements</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { tier: 0, label: 'Standard Eco', price: 'FREE', time: '3 Days', desc: 'Ground & rail freight' },
            { tier: 1, label: 'Aura HyperSpeed', price: '+৳140', time: 'Next Morning', desc: 'Direct air charter hop' },
            { tier: 2, label: 'Autonomous Drone', price: '+৳290', time: '2 Hours', desc: 'Balcony tether drop' },
          ].map((v) => {
            const isSelected = formData.velocityTier === v.tier;
            return (
              <button
                key={v.tier}
                type="button"
                onClick={() => setFormData({ ...formData, velocityTier: v.tier })}
                className={`p-3.5 rounded-2xl text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-2 border-primary bg-primary-fixed/20 shadow-sm'
                    : 'border border-outline-variant/40 bg-surface-container-low hover:bg-surface-container'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-label-sm text-xs uppercase font-bold ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                    {v.label}
                  </span>
                  <span className="font-label-sm text-xs font-bold text-secondary">{v.price}</span>
                </div>
                <p className="font-headline text-base font-bold text-on-surface">{v.time}</p>
                <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">{v.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Packaging & Security */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/40">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-md text-xs font-bold">
              3
            </div>
            <div>
              <h2 className="font-headline text-base text-on-surface font-bold leading-tight">
                Packaging Spec & Freight Insurance
              </h2>
              <p className="font-body-sm text-xs text-on-surface-variant">Protective housing calibrated to parcel sensitivity</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, packaging: 'kevlar' })}
            className={`p-3.5 rounded-2xl text-left transition-all border ${
              formData.packaging === 'kevlar'
                ? 'border-2 border-primary bg-primary-fixed/20'
                : 'border-outline-variant/40 bg-surface-container-low'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-label-sm text-xs font-bold text-on-surface">Tactile Kevlar Pod</span>
              <span className="font-label-sm text-xs font-bold text-primary">+৳45.00</span>
            </div>
            <p className="font-body-sm text-[11px] text-on-surface-variant">
              Shock absorption up to 4.2m drop, tamper-evident thermal sensors
            </p>
          </button>

          <button
            type="button"
            onClick={() => setFormData({ ...formData, packaging: 'carbon' })}
            className={`p-3.5 rounded-2xl text-left transition-all border ${
              formData.packaging === 'carbon'
                ? 'border-2 border-primary bg-primary-fixed/20'
                : 'border-outline-variant/40 bg-surface-container-low'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-label-sm text-xs font-bold text-on-surface">Carbon-Neutral Pod</span>
              <span className="font-label-sm text-xs font-bold text-secondary">FREE</span>
            </div>
            <p className="font-body-sm text-[11px] text-on-surface-variant">
              100% biodegradable compressed cellulose fiber air-cushion
            </p>
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="insureCheck"
              checked={formData.insurance}
              onChange={(e) => setFormData({ ...formData, insurance: e.target.checked })}
              className="rounded accent-primary w-4 h-4 cursor-pointer"
            />
            <label htmlFor="insureCheck" className="font-body-sm text-xs text-on-surface cursor-pointer">
              Add Full Cargo Insurance (100% replacement value on flight anomalies)
            </label>
          </div>
          <span className="font-mono text-xs font-bold text-on-surface">+৳35</span>
        </div>
      </div>

      {/* Step 4: Payment Protocol */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/40">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-md text-xs font-bold">
            4
          </div>
          <div>
            <h2 className="font-headline text-base text-on-surface font-bold leading-tight">
              Payment Protocol
            </h2>
            <p className="font-body-sm text-xs text-on-surface-variant">Select authorized clearing channel</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'cod', label: 'Cash on Delivery', desc: 'Pay courier at doorstep' },
            { id: 'bkash', label: 'bKash / Nagad', desc: 'Direct MFS instant transfer' },
            { id: 'card', label: 'Encrypted Card', desc: 'Quantum TLS 256-bit' },
          ].map((m) => {
            const isSelected = formData.paymentMethod === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: m.id })}
                className={`p-3.5 rounded-2xl text-left transition-all border ${
                  isSelected
                    ? 'border-2 border-primary bg-primary-fixed/20 shadow-sm'
                    : 'border-outline-variant/40 bg-surface-container-low'
                }`}
              >
                <p className="font-label-lg text-xs font-bold text-on-surface">{m.label}</p>
                <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">{m.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 rounded-full bg-primary text-on-primary font-bold text-sm uppercase tracking-wider hover:bg-primary-container active:scale-98 transition-all flex items-center justify-center gap-2 shadow-lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Broadcasting Manifest to Mesh...</span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[20px]">verified</span>
            <span>Confirm & Dispatch Manifest (৳{finalTotal.toLocaleString()})</span>
          </>
        )}
      </button>
    </form>
  );
}
