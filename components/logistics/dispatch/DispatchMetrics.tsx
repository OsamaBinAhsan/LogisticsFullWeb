"use client";

import React from "react";
import { type PipelineMetrics } from "@/types/logistics";
import { formatBDT } from "@/lib/utils";
import {
  PackageCheck,
  Clock,
  Truck,
  AlertOctagon,
  Coins,
  ArrowUpRight,
} from "lucide-react";

interface DispatchMetricsProps {
  metrics: PipelineMetrics;
}

export const DispatchMetrics: React.FC<DispatchMetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {/* 1. Ready to Pack */}
      <div className="hardware-panel rounded-lg p-3.5 corner-crosshairs hover:border-hazard-amber/50 transition-all group">
        <div className="flex items-center justify-between text-zinc-400 mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <PackageCheck className="w-3.5 h-3.5 text-hazard-amber" />
            Ready to Pack
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-hazard-amber animate-ping" />
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-mono font-bold text-white tracking-tight">
            {metrics.readyToPackCount}
          </span>
          <span className="text-[10px] font-mono text-hazard-amber bg-hazard-amber/10 px-1.5 py-0.5 rounded border border-hazard-amber/30">
            Awaiting Box
          </span>
        </div>
        <div className="mt-2 text-[10px] text-zinc-500 font-mono">
          Avg pick: 4.2 mins / parcel
        </div>
      </div>

      {/* 2. Awaiting Pickup */}
      <div className="hardware-panel rounded-lg p-3.5 corner-crosshairs hover:border-hyper-teal/50 transition-all">
        <div className="flex items-center justify-between text-zinc-400 mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-hyper-teal" />
            Awaiting Pickup
          </span>
          <span className="text-[10px] font-mono text-hyper-teal bg-hyper-teal/10 px-1.5 py-0.5 rounded border border-hyper-teal/30">
            Manifested
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-mono font-bold text-white tracking-tight">
            {metrics.awaitingPickupCount}
          </span>
          <span className="text-[10px] font-mono text-zinc-400">
            3 Couriers
          </span>
        </div>
        <div className="mt-2 text-[10px] text-zinc-500 font-mono">
          Pickup window: 2 PM - 5 PM
        </div>
      </div>

      {/* 3. In Transit */}
      <div className="hardware-panel rounded-lg p-3.5 corner-crosshairs hover:border-blue-500/50 transition-all">
        <div className="flex items-center justify-between text-zinc-400 mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-blue-400" />
            In Transit
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-[10px] font-mono text-blue-400">Live</span>
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-mono font-bold text-white tracking-tight">
            {metrics.inTransitCount}
          </span>
          <span className="text-[10px] font-mono text-zinc-400 flex items-center">
            {metrics.avgDeliveryHours}h SLA
          </span>
        </div>
        <div className="mt-2 text-[10px] text-zinc-500 font-mono">
          Success rate: {metrics.deliverySuccessRate}%
        </div>
      </div>

      {/* 4. Return Risks (RTO) */}
      <div className="hardware-panel rounded-lg p-3.5 corner-crosshairs border-razor-crimson/30 hover:border-razor-crimson/60 transition-all bg-razor-crimson/5">
        <div className="flex items-center justify-between text-zinc-400 mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-razor-crimson flex items-center gap-1.5 font-bold">
            <AlertOctagon className="w-3.5 h-3.5 text-razor-crimson animate-pulse" />
            RTO Return Risks
          </span>
          <span className="text-[10px] font-mono text-razor-crimson bg-razor-crimson/20 px-1.5 py-0.5 rounded border border-razor-crimson/40 font-bold">
            ACTION
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-mono font-bold text-razor-crimson tracking-tight">
            {metrics.rtoRiskCount}
          </span>
          <span className="text-[10px] font-mono text-zinc-400">
            Needs call
          </span>
        </div>
        <div className="mt-2 text-[10px] text-razor-crimson/80 font-mono">
          Failed attempts / doorstep
        </div>
      </div>

      {/* 5. COD Settlement Due */}
      <div className="hardware-panel rounded-lg p-3.5 corner-crosshairs hover:border-emerald-500/50 transition-all col-span-2 md:col-span-1">
        <div className="flex items-center justify-between text-zinc-400 mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-emerald-400" />
            COD Receivable
          </span>
          <span className="text-emerald-400 flex items-center text-[10px] font-mono">
            <ArrowUpRight className="w-3 h-3" />
            Pending
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-mono font-bold text-emerald-400 tracking-tight">
            {formatBDT(metrics.codSettlementDue)}
          </span>
        </div>
        <div className="mt-2 text-[10px] text-zinc-500 font-mono">
          Settlement cycle: Next Day
        </div>
      </div>
    </div>
  );
};
