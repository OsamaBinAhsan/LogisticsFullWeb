'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, animate, useTransform } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  change: number;
  icon: LucideIcon;
  format?: 'currency' | 'number' | 'percent';
  prefix?: string;
  color?: string;
}


export function StatCard({ title, value, change, icon: Icon, format = 'number', prefix = '' }: StatCardProps) {
  const count = useMotionValue(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const controls = animate(count, value, { duration: 1.5, ease: 'easeOut' });
    return controls.stop;
  }, [value, count]);

  const formattedValue = useTransform(count, (latest) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(latest);
    }
    if (format === 'percent') {
      return `${latest.toFixed(1)}%`;
    }
    return Math.floor(latest).toLocaleString();
  });

  const isPositive = change >= 0;

  return (
    <div className="bg-[#0E121B]/85 border border-[#1E293B]/70 rounded-xl p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] relative overflow-hidden group flex flex-col justify-between">
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#14B8A6]/5 rounded-full blur-2xl group-hover:bg-[#14B8A6]/10 transition-colors duration-500" />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
        <div className="p-2 bg-[#1E293B]/50 rounded-lg text-slate-300">
          <Icon size={18} />
        </div>
      </div>
      
      <div className="flex items-baseline space-x-2 relative z-10">
        <div className="text-3xl font-bold text-white font-mono flex items-baseline">
          {prefix && <span className="text-xl text-slate-400 mr-1">{prefix}</span>}
          {isMounted ? <motion.span>{formattedValue}</motion.span> : <span>0</span>}
        </div>
      </div>
      
      <div className="mt-4 flex items-center text-xs relative z-10">
        <span
          className={cn(
            'flex items-center font-medium px-1.5 py-0.5 rounded-md',
            isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
          )}
        >
          {isPositive ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
          {Math.abs(change)}%
        </span>
        <span className="text-slate-500 ml-2">vs last period</span>
      </div>
    </div>
  );
}
