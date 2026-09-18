'use client';

import React from 'react';
import Link from 'next/link';

interface TopBarProps {
  title?: string;
  subtitle?: string;
}

export function TopBar({
  title = 'Operations Console',
  subtitle = 'AuraOS v4.8',
}: TopBarProps = {}) {
  return (
    <header className="sticky top-0 z-40 h-16 w-full flex items-center justify-between px-6 bg-surface-container-lowest/90 backdrop-blur-xl border-b border-surface-container shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[18px]">radar</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-headline text-lg font-bold tracking-tight text-on-surface">
              Aura<span className="text-primary">OS</span>
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-label-sm text-[10px] bg-inverse-surface text-inverse-on-surface tracking-widest uppercase font-bold">
              Admin
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-xs border border-outline-variant/30">
          <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse" />
          <span>Global Node: US-EAST-A (Operational)</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container transition-colors text-on-surface-variant font-label-sm text-xs font-bold"
        >
          <span className="material-symbols-outlined text-[16px]">storefront</span>
          Storefront
        </Link>

        <div className="h-4 w-px bg-outline-variant/40" />

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[18px]">shield_person</span>
          </div>
          <div className="hidden sm:block text-left">
            <p className="font-label-md text-xs font-bold text-on-surface leading-tight">Operations Lead</p>
            <p className="font-label-sm text-[10px] text-on-surface-variant leading-tight">Fleet Level 4</p>
          </div>
        </div>
      </div>
    </header>
  );
}
