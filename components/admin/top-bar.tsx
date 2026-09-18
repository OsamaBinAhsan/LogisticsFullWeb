'use client';

import React from 'react';
import { Search, Bell, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopBarProps {
  title?: string;
  subtitle?: string;
}

export function TopBar({
  title = 'Operations Console',
  subtitle = 'AuraCommerce Enterprise OS',
}: TopBarProps = {}) {

  return (
    <header className="sticky top-0 z-40 h-16 w-full flex items-center justify-between px-6 bg-[#0E121B]/80 backdrop-blur-xl border-b border-[#1E293B]/70 shadow-[0_1px_0_0_rgba(255,255,255,0.02)]">
      <div className="flex flex-col">
        <h1 className="text-lg font-semibold text-white font-display tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative group hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-slate-400 group-focus-within:text-[#14B8A6] transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Quick search... (Press '/')"
            className="w-64 bg-[#1E293B]/50 border border-[#334155] rounded-md py-1.5 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#14B8A6] focus:border-[#14B8A6] transition-all focus:w-80 shadow-inner"
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-block border border-[#334155] bg-[#0E121B] rounded px-1.5 text-[10px] font-mono text-slate-400">
              /
            </kbd>
          </div>
        </div>

        <button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-md hover:bg-[#1E293B]/50">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
        </button>

        <div className="h-6 w-px bg-[#1E293B]" />

        <button className="flex items-center space-x-2 p-1 rounded-md hover:bg-[#1E293B]/50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#14B8A6] to-[#3B82F6] flex items-center justify-center p-[2px]">
            <div className="w-full h-full bg-[#0E121B] rounded-full flex items-center justify-center">
              <UserCircle size={20} className="text-slate-300" />
            </div>
          </div>
        </button>
      </div>
    </header>
  );
}
