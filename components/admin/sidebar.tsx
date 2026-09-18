'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Truck,
  Boxes,
  Printer,
  RotateCcw,
  Layers,
  Sliders,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navSections = [
    {
      title: 'Commerce',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
        { label: 'Orders', icon: ShoppingBag, href: '/admin/orders', badge: { text: '12', color: 'bg-amber-500/20 text-amber-500' } },
        { label: 'Products', icon: Package, href: '/admin/products' },
        { label: 'Customers', icon: Users, href: '/admin/customers' },
      ],
    },
    {
      title: 'Logistics & Fulfillment',
      icon: Truck,
      items: [
        { label: 'Logistics Hub', icon: Truck, href: '/admin/logistics' },
        { label: 'Dispatch Matrix', icon: Boxes, href: '/admin/logistics/dispatch', badge: { text: 'LIVE', color: 'bg-amber-500/20 text-amber-500 border border-amber-500/50' } },
        { label: 'Thermal Labels', icon: Printer, href: '/admin/logistics/labels/print' },
        { label: 'RTO Radar', icon: RotateCcw, href: '/admin/logistics/returns', badge: { text: 'ALERT', color: 'bg-red-500/20 text-red-500 border border-red-500/50' } },
        { label: 'SKU Stock Sync', icon: Layers, href: '/admin/logistics/inventory' },
        { label: 'Courier Gateways', icon: Sliders, href: '/admin/logistics/settings/couriers', badge: { text: '3 ACTIVE', color: 'bg-[#14B8A6]/20 text-[#14B8A6] border border-[#14B8A6]/50' } },
      ],
    },
    {
      title: 'System',
      items: [
        { label: 'Settings', icon: Settings, href: '/admin/settings' },
      ],
    },
  ];

  if (!mounted) return null;

  return (
    <motion.aside
      initial={{ width: 256 }}
      animate={{ width: isCollapsed ? 64 : 256 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="h-screen bg-[#0E121B]/85 border-r border-[#1E293B]/70 flex flex-col relative shrink-0"
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-[#1E293B] border border-[#334155] rounded-full p-1 z-10 text-white hover:bg-[#334155] transition-colors"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="p-4 flex items-center h-16 shrink-0 border-b border-[#1E293B]/70">
        <div className="w-8 h-8 rounded-md bg-[#14B8A6]/20 flex items-center justify-center shrink-0 border border-[#14B8A6]/30">
          <span className="w-3 h-3 rounded-full bg-[#14B8A6]" />
        </div>
        <AnimatePresence mode="popLayout">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="ml-3 overflow-hidden whitespace-nowrap"
            >
              <h1 className="text-white font-semibold font-display tracking-wide">AuraCommerce</h1>
              <p className="text-xs text-slate-400">Commerce OS</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-[#1E293B]">
        {navSections.map((section, idx) => (
          <div key={idx} className="mb-6">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-4 mb-2 flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider h-6"
                >
                  {section.icon && <section.icon size={14} className="mr-2" />}
                  {section.title}
                </motion.div>
              )}
            </AnimatePresence>
            <ul className="space-y-1 px-2">
              {section.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <span
                        className={cn(
                          'flex items-center h-10 px-2 rounded-md transition-all group relative',
                          isActive
                            ? 'bg-[#14B8A6]/10 text-white'
                            : 'text-slate-400 hover:bg-[#1E293B]/50 hover:text-white'
                        )}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="active-nav-indicator"
                            className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#14B8A6] rounded-r-full"
                            initial={false}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}
                        <item.icon size={18} className={cn('shrink-0', isActive ? 'text-[#14B8A6]' : '')} />
                        <AnimatePresence mode="popLayout">
                          {!isCollapsed && (
                            <motion.div
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: 'auto' }}
                              exit={{ opacity: 0, width: 0 }}
                              className="ml-3 flex-1 overflow-hidden whitespace-nowrap flex items-center justify-between"
                            >
                              <span className="text-sm font-medium">{item.label}</span>
                              {item.badge && (
                                <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-bold', item.badge.color)}>
                                  {item.badge.text}
                                </span>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-[#1E293B]/70 shrink-0">
        <button className="flex items-center w-full group">
          <div className="w-8 h-8 rounded-full bg-[#1E293B] flex items-center justify-center shrink-0">
            <UserIcon size={16} className="text-slate-300" />
          </div>
          <AnimatePresence mode="popLayout">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="ml-3 flex-1 flex items-center justify-between overflow-hidden whitespace-nowrap"
              >
                <div className="text-left">
                  <p className="text-sm font-medium text-white group-hover:text-[#14B8A6] transition-colors">Admin User</p>
                  <p className="text-xs text-slate-400">admin@aura.com</p>
                </div>
                <LogOut size={16} className="text-slate-500 group-hover:text-red-400 transition-colors" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
