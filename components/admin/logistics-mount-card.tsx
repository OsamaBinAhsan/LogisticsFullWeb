'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, Boxes, Printer, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LogisticsMountCardProps {
  pendingCount?: number;
  readyForPrint?: number;
  pendingOrders?: number;
}

export function LogisticsMountCard({
  pendingCount,
  readyForPrint = 0,
  pendingOrders,
}: LogisticsMountCardProps) {
  const count = pendingOrders ?? pendingCount ?? 0;
  const hasPending = count > 0;


  return (
    <div className="bg-[#0E121B]/85 border border-[#14B8A6]/30 rounded-xl p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_0_20px_rgba(20,184,166,0.05)] relative overflow-hidden group">
      <div className="absolute right-0 top-0 w-32 h-32 bg-[#14B8A6]/10 rounded-full blur-3xl group-hover:bg-[#14B8A6]/20 transition-colors duration-700" />
      
      <div className="flex items-start gap-4 relative z-10 mb-6">
        <div className="p-3 bg-[#14B8A6]/10 rounded-xl border border-[#14B8A6]/20">
          <Truck size={24} className="text-[#14B8A6]" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold text-lg font-display tracking-tight">Logistics Bridge</h3>
            {hasPending && (
              <span className="flex items-center gap-1.5 bg-amber-500/10 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-1.5 h-1.5 bg-amber-500 rounded-full"
                />
                Action Required
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 mt-1">Connect commerce to fulfillment operations.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
        <div className="bg-[#1E293B]/40 rounded-lg p-3 border border-[#334155]/50 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium mb-1">Pending Booking</span>
          <span className="text-2xl font-mono font-bold text-white">{count}</span>
        </div>

        <div className="bg-[#1E293B]/40 rounded-lg p-3 border border-[#334155]/50 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium mb-1">Ready for Print</span>
          <span className="text-2xl font-mono font-bold text-white">{readyForPrint}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 relative z-10">
        <Link href="/admin/logistics/dispatch" className="flex-1">
          <button className="w-full flex items-center justify-center gap-2 bg-[#14B8A6] hover:bg-[#0D9488] text-white py-2 px-4 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(20,184,166,0.2)] hover:shadow-[0_0_20px_rgba(20,184,166,0.4)]">
            <Boxes size={16} />
            Open Dispatch Board
            <ArrowRight size={14} className="ml-1 opacity-70" />
          </button>
        </Link>
        <Link href="/admin/logistics/labels/print" className="flex-1">
          <button className="w-full flex items-center justify-center gap-2 bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-white py-2 px-4 rounded-lg text-sm font-medium transition-all">
            <Printer size={16} />
            Print Labels
          </button>
        </Link>
      </div>
    </div>
  );
}
