'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const navItems = [
    { label: 'Overview', href: '/admin', icon: 'dashboard' },
    { label: 'Shipments', href: '/admin/orders', icon: 'local_shipping', badge: '12' },
    { label: 'Inventory & Products', href: '/admin/inventory', icon: 'inventory_2' },
    { label: 'Reviews Moderation', href: '/admin/reviews', icon: 'rate_review', badge: 'Active' },
    { label: 'Carrier Telemetry', href: '/admin/logistics', icon: 'radar' },
    { label: 'Dispatch Matrix', href: '/admin/logistics/dispatch', icon: 'precision_manufacturing', badge: 'LIVE' },
    { label: 'Thermal 4×6 Labels', href: '/admin/logistics/labels/print', icon: 'print' },
    { label: 'RTO Radar', href: '/admin/logistics/returns', icon: 'rotate_left' },
    { label: 'Settings', href: '/admin/settings', icon: 'settings' },
  ];

  return (
    <aside className="w-64 bg-surface-container-lowest border-r border-surface-container flex flex-col justify-between p-4 shrink-0 select-none h-screen">
      <div className="space-y-6 overflow-y-auto">
        <div className="px-2 pt-2">
          <p className="font-label-sm text-[11px] uppercase tracking-widest text-outline font-bold mb-3">
            Dispatch & Operations
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname === item.href || pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-label-md text-xs transition-all ${
                    isActive
                      ? 'bg-primary text-on-primary font-bold shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-secondary-container text-on-secondary-container'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* System Health Progress Widget */}
      <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
            System Health
          </span>
          <span className="font-label-sm text-xs text-secondary font-bold">99.98%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
          <div className="h-full bg-secondary-fixed rounded-full w-[99.98%]" />
        </div>
        <span className="font-mono text-[9px] text-outline block">ISO-9002 Telemetry Live</span>
      </div>
    </aside>
  );
}
