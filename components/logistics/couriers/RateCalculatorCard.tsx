"use client";

import React, { useState, useEffect } from "react";
import { mockCourierService } from "@/lib/services/couriers/mock-courier.service";
import { formatBDT, calculateVolumetricWeight } from "@/lib/utils";
import { useHapticAudio } from "@/lib/hooks/use-haptic-audio";
import {
  Calculator,
  Flame,
  Zap,
  Clock,
  Box,
  CheckCircle2,
} from "lucide-react";

export const RateCalculatorCard: React.FC = () => {
  const { playMechanicalClick } = useHapticAudio();

  const [zone, setZone] = useState<string>("dhaka_inside");
  const [actualWeightKg, setActualWeightKg] = useState<number>(1.0);
  const [lengthCm, setLengthCm] = useState<number>(20);
  const [widthCm, setWidthCm] = useState<number>(15);
  const [heightCm, setHeightCm] = useState<number>(10);

  const [rates, setRates] = useState<
    {
      courier: string;
      displayName: string;
      rate: number;
      estimatedDays: string;
    }[]
  >([]);

  const volWeight = calculateVolumetricWeight(lengthCm, widthCm, heightCm);
  const effectiveWeight = Math.max(actualWeightKg, volWeight);

  useEffect(() => {
    async function updateRates() {
      const results = await mockCourierService.calculateAllRates(zone, effectiveWeight);
      setRates(results);
    }
    updateRates();
  }, [zone, effectiveWeight]);

  return (
    <div className="hardware-panel rounded-xl p-5 border border-obsidian-border space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-obsidian-border pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="dyno-tape">SIMULATION ENGINE</span>
            <span className="text-[11px] font-mono text-zinc-500">
              CROSS-CARRIER BENCHMARK
            </span>
          </div>
          <h3 className="text-base font-bold text-white font-mono uppercase mt-1">
            Dynamic Rate Calculator & SLA Matrix
          </h3>
        </div>
        <p className="text-xs font-mono text-zinc-400">
          Simulate volumetric vs deadweight shipping tariffs before dispatch.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
        {/* Left Inputs */}
        <div className="space-y-3">
          <div>
            <label className="block text-zinc-400 text-[10px] uppercase font-semibold mb-1">
              Destination Geographic Zone
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "dhaka_inside", label: "Inside Dhaka" },
                { id: "dhaka_sub", label: "Sub-Dhaka" },
                { id: "outside_dhaka", label: "Outside Dhaka" },
              ].map((z) => (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => {
                    playMechanicalClick();
                    setZone(z.id);
                  }}
                  className={`py-2 px-2 rounded border text-center transition-all ${
                    zone === z.id
                      ? "bg-hazard-amber/15 border-hazard-amber text-hazard-amber font-bold"
                      : "bg-obsidian-card border-obsidian-border text-zinc-400 hover:text-white"
                  }`}
                >
                  {z.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 text-[10px] uppercase font-semibold mb-1">
                Deadweight (Kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={actualWeightKg}
                onChange={(e) => setActualWeightKg(parseFloat(e.target.value) || 0.1)}
                className="w-full bg-carbon border border-obsidian-border rounded px-3 py-1.5 text-white font-mono focus:border-hazard-amber focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-[10px] uppercase font-semibold mb-1 flex items-center justify-between">
                <span>Volumetric Wt</span>
                <span className="text-zinc-500 text-[9px]">(LxWxH/5000)</span>
              </label>
              <div className="w-full bg-carbon/50 border border-obsidian-border rounded px-3 py-1.5 text-zinc-300 font-bold">
                {volWeight} kg
              </div>
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 text-[10px] uppercase font-semibold mb-1">
              Box Dimensions (L x W x H in cm)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                value={lengthCm}
                onChange={(e) => setLengthCm(parseInt(e.target.value, 10) || 1)}
                placeholder="L"
                className="bg-carbon border border-obsidian-border rounded px-2.5 py-1.5 text-white text-center font-mono focus:border-hazard-amber focus:outline-none"
              />
              <input
                type="number"
                value={widthCm}
                onChange={(e) => setWidthCm(parseInt(e.target.value, 10) || 1)}
                placeholder="W"
                className="bg-carbon border border-obsidian-border rounded px-2.5 py-1.5 text-white text-center font-mono focus:border-hazard-amber focus:outline-none"
              />
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(parseInt(e.target.value, 10) || 1)}
                placeholder="H"
                className="bg-carbon border border-obsidian-border rounded px-2.5 py-1.5 text-white text-center font-mono focus:border-hazard-amber focus:outline-none"
              />
            </div>
          </div>

          <div className="p-2.5 rounded bg-carbon border border-obsidian-border text-[11px] text-zinc-400 flex items-center justify-between">
            <span>Billable Chargeable Weight:</span>
            <span className="text-white font-bold text-xs font-mono">
              {effectiveWeight} kg{" "}
              <span className="text-[10px] text-zinc-500 font-normal">
                ({effectiveWeight === volWeight ? "Volumetric Bound" : "Deadweight Bound"})
              </span>
            </span>
          </div>
        </div>

        {/* Right Output Comparison Cards */}
        <div className="space-y-2.5">
          <label className="block text-zinc-400 text-[10px] uppercase font-semibold">
            Live Carrier Tariffs & Delivery Timeframes
          </label>

          <div className="space-y-2">
            {rates.map((r, idx) => {
              const isBest = idx === 0;

              return (
                <div
                  key={r.courier}
                  className={`p-3 rounded-lg border transition-all flex items-center justify-between ${
                    isBest
                      ? "bg-hazard-amber/10 border-hazard-amber/60 shadow-tactile"
                      : "bg-obsidian-card border-obsidian-border hover:bg-obsidian-hover"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white uppercase">
                        {r.displayName}
                      </span>
                      {isBest && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-hazard-amber text-black uppercase">
                          Recommended
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-hyper-teal" />
                      <span>SLA: {r.estimatedDays}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-bold font-mono text-hazard-amber">
                      {formatBDT(r.rate)}
                    </div>
                    <div className="text-[9px] text-zinc-500">
                      COD Fee: 1% extra
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
