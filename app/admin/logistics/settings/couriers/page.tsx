"use client";

import React, { useState } from "react";
import { mockCourierService } from "@/lib/services/couriers/mock-courier.service";
import { ScannerNav } from "@/components/logistics/layout/ScannerNav";
import { CourierAccountCard } from "@/components/logistics/couriers/CourierAccountCard";
import { RateCalculatorCard } from "@/components/logistics/couriers/RateCalculatorCard";
import { useHapticAudio } from "@/lib/hooks/use-haptic-audio";
import {
  Save,
  CheckCircle2,
} from "lucide-react";

export default function CourierSettingsPage() {
  const { playMechanicalClick, playSuccessChime } = useHapticAudio();
  const couriers = mockCourierService.getAllCouriers();

  const [insideDhakaRate, setInsideDhakaRate] = useState<number>(60);
  const [subDhakaRate, setSubDhakaRate] = useState<number>(100);
  const [outsideDhakaRate, setOutsideDhakaRate] = useState<number>(130);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(2000);
  const [codPercentage, setCodPercentage] = useState<number>(1.0);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSavePresets = () => {
    playMechanicalClick();
    playSuccessChime();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <ScannerNav />

      <div className="p-6 max-w-7xl w-full mx-auto space-y-6 flex-1">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="dyno-tape">COURIER ORCHESTRATION</span>
              <span className="text-xs font-mono text-zinc-400">
                MULTI-PROVIDER GATEWAY
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight font-mono uppercase mt-1">
              Courier Integrations & Tariff Presets
            </h1>
            <p className="text-xs text-zinc-400 font-mono">
              Manage live API credentials, webhook tokens, and customer checkout delivery fees.
            </p>
          </div>
        </div>

        {/* Courier API Gateways */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-hazard-amber" />
            <h2 className="text-sm font-mono font-bold uppercase text-white">
              Connected Courier Adapters (Pluggable Architecture)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {couriers.map((item) => (
              <CourierAccountCard key={item.name} adapter={item.adapter} />
            ))}
          </div>
        </div>

        {/* Dynamic Rate Calculator Simulator */}
        <RateCalculatorCard />

        {/* Delivery Charge Presets & COD Policy Settings */}
        <div className="hardware-panel rounded-xl p-5 border border-obsidian-border space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-obsidian-border pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="dyno-tape">MERCHANT CHARGE PRESETS</span>
                <span className="text-[11px] font-mono text-zinc-500">
                  FRONTEND CHECKOUT MATRIX
                </span>
              </div>
              <h3 className="text-base font-bold text-white font-mono uppercase mt-1">
                Store Delivery Fees & Cash On Delivery (COD) Rules
              </h3>
            </div>

            <button
              onClick={handleSavePresets}
              className="px-4 py-2 rounded-lg bg-hazard-amber hover:bg-hazard-amber-light text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-glow-amber active:scale-95 transition-all"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Tariff Presets</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 font-mono text-xs">
            <div className="bg-obsidian-card p-3 rounded-lg border border-obsidian-border">
              <label className="text-zinc-400 text-[10px] uppercase font-semibold block mb-1">
                Inside Dhaka (BDT)
              </label>
              <input
                type="number"
                value={insideDhakaRate}
                onChange={(e) => setInsideDhakaRate(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-carbon border border-obsidian-border rounded px-2.5 py-1.5 text-white font-bold focus:border-hazard-amber focus:outline-none"
              />
            </div>

            <div className="bg-obsidian-card p-3 rounded-lg border border-obsidian-border">
              <label className="text-zinc-400 text-[10px] uppercase font-semibold block mb-1">
                Sub-Dhaka / Suburban (BDT)
              </label>
              <input
                type="number"
                value={subDhakaRate}
                onChange={(e) => setSubDhakaRate(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-carbon border border-obsidian-border rounded px-2.5 py-1.5 text-white font-bold focus:border-hazard-amber focus:outline-none"
              />
            </div>

            <div className="bg-obsidian-card p-3 rounded-lg border border-obsidian-border">
              <label className="text-zinc-400 text-[10px] uppercase font-semibold block mb-1">
                Outside Dhaka (BDT)
              </label>
              <input
                type="number"
                value={outsideDhakaRate}
                onChange={(e) => setOutsideDhakaRate(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-carbon border border-obsidian-border rounded px-2.5 py-1.5 text-white font-bold focus:border-hazard-amber focus:outline-none"
              />
            </div>

            <div className="bg-obsidian-card p-3 rounded-lg border border-obsidian-border">
              <label className="text-zinc-400 text-[10px] uppercase font-semibold block mb-1">
                Free Shipping Order Min (BDT)
              </label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-carbon border border-obsidian-border rounded px-2.5 py-1.5 text-emerald-400 font-bold focus:border-hazard-amber focus:outline-none"
              />
            </div>

            <div className="bg-obsidian-card p-3 rounded-lg border border-obsidian-border">
              <label className="text-zinc-400 text-[10px] uppercase font-semibold block mb-1">
                COD Fee (% Collected)
              </label>
              <input
                type="number"
                step="0.1"
                value={codPercentage}
                onChange={(e) => setCodPercentage(parseFloat(e.target.value) || 0)}
                className="w-full bg-carbon border border-obsidian-border rounded px-2.5 py-1.5 text-hazard-amber font-bold focus:border-hazard-amber focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
