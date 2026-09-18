"use client";

import React from "react";
import { motion } from "framer-motion";

interface ReturnReasonItem {
  reason: string;
  key: string;
  percentage: number;
  count: number;
  color: string;
}

interface ReasonPillBarProps {
  reasons: ReturnReasonItem[];
}

export const ReasonPillBar: React.FC<ReasonPillBarProps> = ({ reasons }) => {
  return (
    <div className="hardware-panel rounded-xl p-5 border border-obsidian-border space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-obsidian-border pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="dyno-tape">DIAGNOSTIC RADAR</span>
            <span className="text-[11px] font-mono text-zinc-500">
              SAMPLE: LAST 30 DAYS
            </span>
          </div>
          <h2 className="text-base font-bold text-white font-mono uppercase mt-1">
            Top Return (RTO) Driver Breakdown
          </h2>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-zinc-400">Total Returns:</span>
          <span className="ml-1.5 text-sm font-mono font-bold text-razor-crimson">
            85 Parcels
          </span>
        </div>
      </div>

      {/* Stacked Percentage Progress Bar */}
      <div className="w-full h-4 rounded-full overflow-hidden flex bg-carbon border border-obsidian-border p-0.5 gap-0.5">
        {reasons.map((r) => (
          <motion.div
            key={r.key}
            initial={{ width: 0 }}
            animate={{ width: `${r.percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            title={`${r.reason}: ${r.percentage}%`}
            style={{ backgroundColor: r.color }}
            className="h-full rounded-sm"
          />
        ))}
      </div>

      {/* Reason Breakdown List with percentage pills */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
        {reasons.map((r) => (
          <div
            key={r.key}
            className="p-3 rounded-lg bg-obsidian-card border border-obsidian-border flex items-center justify-between font-mono"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: r.color }}
                />
                <span className="text-xs text-zinc-200 font-medium truncate max-w-[200px]">
                  {r.reason}
                </span>
              </div>
              <div className="text-[10px] text-zinc-500 pl-4">
                {r.count} incidents recorded
              </div>
            </div>

            <span
              className="text-xs font-bold px-2 py-0.5 rounded border"
              style={{
                color: r.color,
                borderColor: `${r.color}50`,
                backgroundColor: `${r.color}15`,
              }}
            >
              {r.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
