"use client";

import React from "react";
import { type GeographicRiskZone } from "@/types/logistics";
import { ShieldCheck, AlertTriangle, Flame } from "lucide-react";

interface HeatmapGridProps {
  zones: GeographicRiskZone[];
}

export const HeatmapGrid: React.FC<HeatmapGridProps> = ({ zones }) => {
  return (
    <div className="hardware-panel rounded-xl p-5 border border-obsidian-border space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-obsidian-border pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="dyno-tape">GEOGRAPHIC MATRIX</span>
            <span className="text-[11px] font-mono text-zinc-500">
              REAL-TIME COURIER TELEMETRY
            </span>
          </div>
          <h2 className="text-base font-bold text-white font-mono uppercase mt-1">
            Regional Delivery Zone Risk Heatmap
          </h2>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            &gt;94% Safe Zone
          </span>
          <span className="flex items-center gap-1.5 text-hazard-amber">
            <span className="w-2 h-2 rounded-full bg-hazard-amber" />
            85-93% Moderate
          </span>
          <span className="flex items-center gap-1.5 text-razor-crimson font-bold">
            <span className="w-2 h-2 rounded-full bg-razor-crimson animate-pulse" />
            &lt;80% High RTO Risk
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b border-obsidian-border bg-obsidian-card/80 text-[11px] uppercase tracking-wider text-zinc-400">
              <th className="py-2.5 px-3">Geographic Hub / Zone</th>
              <th className="py-2.5 px-3">Division</th>
              <th className="py-2.5 px-3 text-right">Shipments</th>
              <th className="py-2.5 px-3 text-right">Success Rate</th>
              <th className="py-2.5 px-3 text-center">Risk Level</th>
              <th className="py-2.5 px-3 text-right">Avg Attempts</th>
              <th className="py-2.5 px-3">Primary Failure Pattern</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-obsidian-border/50">
            {zones.map((zone) => {
              const isHigh = zone.riskLevel === "high";
              const isMed = zone.riskLevel === "medium";
              const isLow = zone.riskLevel === "low";

              return (
                <tr
                  key={zone.zoneName}
                  className={`hover:bg-obsidian-hover/40 transition-colors ${
                    isHigh ? "bg-razor-crimson/5" : ""
                  }`}
                >
                  <td className="py-3 px-3 font-semibold text-zinc-200">
                    <div className="flex items-center gap-2">
                      {isHigh ? (
                        <Flame className="w-3.5 h-3.5 text-razor-crimson shrink-0" />
                      ) : isLow ? (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-hazard-amber shrink-0" />
                      )}
                      <span>{zone.zoneName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-zinc-400">{zone.division}</td>
                  <td className="py-3 px-3 text-right text-zinc-300">
                    {zone.totalShipments}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`font-bold px-2 py-0.5 rounded ${
                        isLow
                          ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/30"
                          : isMed
                          ? "text-hazard-amber bg-hazard-amber/10 border border-hazard-amber/30"
                          : "text-razor-crimson bg-razor-crimson/20 border border-razor-crimson/50"
                      }`}
                    >
                      {zone.successRate}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        isLow
                          ? "bg-emerald-500/15 text-emerald-400"
                          : isMed
                          ? "bg-hazard-amber/15 text-hazard-amber"
                          : "bg-razor-crimson/20 text-razor-crimson animate-pulse"
                      }`}
                    >
                      {zone.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-zinc-300">
                    {zone.avgAttemptCount}x
                  </td>
                  <td className="py-3 px-3 text-zinc-400 text-[11px] truncate max-w-[220px]">
                    {zone.commonFailureReason}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
