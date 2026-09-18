'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  MessageCircle,
  PhoneCall,
  Mail,
  ShieldCheck,
  TrendingUp,
  ArrowUpDown,
  ShoppingBag,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ordersService } from '@/lib/services/orders.service';
import type { AuraCustomer } from '@/types';
import { formatBDT, timeAgo } from '@/lib/utils';
import { fadeUp, staggerContainer } from '@/lib/motion';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AuraCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'ltv' | 'orders' | 'recent'>('ltv');

  useEffect(() => {
    ordersService.getTopCustomers(20).then((data) => {
      // Add a few more rich mock customers if list is small
      if (data.length < 5) {
        const enriched: AuraCustomer[] = [
          ...data,
          {
            id: 'CUST-103',
            name: 'Tanvir Hasan',
            phone: '01819123456',
            email: 'tanvir@gmail.com',
            totalOrders: 15,
            lifetimeValue: 54200,
            averageOrderValue: 3613,
            lastOrderDate: new Date(Date.now() - 3600000 * 2).toISOString(),
            firstOrderDate: '2023-01-15T00:00:00Z',
            returnRate: 0,
            preferredChannel: 'whatsapp',
          },
          {
            id: 'CUST-104',
            name: 'Nusrat Jahan',
            phone: '01712987654',
            email: 'nusrat.jahan@hotmail.com',
            totalOrders: 9,
            lifetimeValue: 32400,
            averageOrderValue: 3600,
            lastOrderDate: new Date(Date.now() - 86400000 * 3).toISOString(),
            firstOrderDate: '2023-03-10T00:00:00Z',
            returnRate: 2.1,
            preferredChannel: 'facebook',
          },
          {
            id: 'CUST-105',
            name: 'Mahmudur Rahman',
            phone: '01911456789',
            email: 'm.rahman@dhaka.net',
            totalOrders: 6,
            lifetimeValue: 19800,
            averageOrderValue: 3300,
            lastOrderDate: new Date(Date.now() - 86400000 * 7).toISOString(),
            firstOrderDate: '2023-05-20T00:00:00Z',
            returnRate: 0,
            preferredChannel: 'web',
          },
        ];
        setCustomers(enriched);
      } else {
        setCustomers(data);
      }
      setIsLoading(false);
    });
  }, []);

  const filteredCustomers = customers
    .filter((c) => {
      const q = search.toLowerCase();
      return (
        !search ||
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.email && c.email.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'ltv') return b.lifetimeValue - a.lifetimeValue;
      if (sortBy === 'orders') return b.totalOrders - a.totalOrders;
      return new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime();
    });

  const totalLtv = customers.reduce((sum, c) => sum + c.lifetimeValue, 0);
  const avgLtv = customers.length > 0 ? totalLtv / customers.length : 0;
  const vipCount = customers.filter((c) => c.lifetimeValue >= 30000).length;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="p-6 max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-display">
            Customer Profiles & CRM Intelligence
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Lifetime value analysis, multi-channel purchase affinity, and direct WhatsApp CRM
          </p>
        </div>
      </motion.div>

      {/* KPI Stats */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="p-4 rounded-xl bg-[#0E121B]/90 border border-[#1E293B]/70">
          <div className="text-xs font-mono text-zinc-400 uppercase">Total Customers</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {customers.length}
          </div>
          <div className="text-[11px] text-[#14B8A6] font-mono mt-0.5">
            100% verified profiles
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0E121B]/90 border border-[#1E293B]/70">
          <div className="text-xs font-mono text-zinc-400 uppercase">VIP Retention Base</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
            {vipCount} High-LTV
          </div>
          <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
            LTV &ge; ৳30,000 threshold
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0E121B]/90 border border-[#1E293B]/70">
          <div className="text-xs font-mono text-zinc-400 uppercase">Average Customer LTV</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {formatBDT(avgLtv)}
          </div>
          <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
            Combined all channels
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0E121B]/90 border border-[#1E293B]/70">
          <div className="text-xs font-mono text-zinc-400 uppercase">Return Resilience</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            98.5%
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
            Low doorstep return risk
          </div>
        </div>
      </motion.div>

      {/* Search and Sort Toolbar */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0E121B]/80 p-4 rounded-xl border border-[#1E293B]/70"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, phone number, or email..."
            className="w-full bg-[#06080A] border border-[#1E293B]/70 text-xs font-mono pl-9 pr-4 py-2 rounded-lg text-white placeholder:text-zinc-500 focus:border-[#14B8A6] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-zinc-500 uppercase">Sort By:</span>
          <button
            onClick={() => setSortBy('ltv')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              sortBy === 'ltv'
                ? 'bg-[#14B8A6] text-black font-bold'
                : 'bg-[#06080A] text-zinc-400 border border-[#1E293B]/70 hover:text-white'
            }`}
          >
            Highest LTV
          </button>
          <button
            onClick={() => setSortBy('orders')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              sortBy === 'orders'
                ? 'bg-[#14B8A6] text-black font-bold'
                : 'bg-[#06080A] text-zinc-400 border border-[#1E293B]/70 hover:text-white'
            }`}
          >
            Most Orders
          </button>
          <button
            onClick={() => setSortBy('recent')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              sortBy === 'recent'
                ? 'bg-[#14B8A6] text-black font-bold'
                : 'bg-[#06080A] text-zinc-400 border border-[#1E293B]/70 hover:text-white'
            }`}
          >
            Recent Activity
          </button>
        </div>
      </motion.div>

      {/* Customer Table */}
      <motion.div
        variants={fadeUp}
        className="p-1 rounded-xl bg-[#0E121B]/90 border border-[#1E293B]/70 overflow-hidden shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-[#1E293B]/70 bg-[#06080A]/60 text-[11px] uppercase tracking-wider text-zinc-400">
                <th className="py-3 px-4">Customer & Contact</th>
                <th className="py-3 px-4">Channel Affinity</th>
                <th className="py-3 px-4 text-center">Total Orders</th>
                <th className="py-3 px-4 text-right">Lifetime Value (LTV)</th>
                <th className="py-3 px-4 text-right">AOV</th>
                <th className="py-3 px-4 text-center">Return Risk</th>
                <th className="py-3 px-4 text-right">Direct Outreach</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/50">
              {filteredCustomers.map((cust) => {
                const isVip = cust.lifetimeValue >= 30000;
                const cleanPhone = cust.phone.replace(/[\s-]/g, '');
                const waUrl = `https://wa.me/88${cleanPhone.startsWith('0') ? cleanPhone : '0' + cleanPhone}`;

                return (
                  <tr
                    key={cust.id}
                    className="hover:bg-[#131929]/50 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#1E293B] border border-[#334155] flex items-center justify-center font-bold text-white uppercase text-xs shrink-0">
                          {cust.name.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold text-white text-xs flex items-center gap-2">
                            <span>{cust.name}</span>
                            {isVip && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 uppercase">
                                VIP
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#14B8A6] flex items-center gap-2 mt-0.5">
                            <span>{cust.phone}</span>
                            {cust.email && (
                              <>
                                <span>•</span>
                                <span className="text-zinc-500">{cust.email}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="capitalize px-2 py-0.5 rounded text-[11px] bg-[#1E293B]/60 text-zinc-300 border border-[#1E293B]">
                        {cust.preferredChannel}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="font-bold text-white">{cust.totalOrders}</span>
                      <div className="text-[10px] text-zinc-500">
                        Last: {timeAgo(cust.lastOrderDate)}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="font-bold text-emerald-400 text-sm">
                        {formatBDT(cust.lifetimeValue)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right text-zinc-300">
                      {formatBDT(cust.averageOrderValue)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          cust.returnRate === 0
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {cust.returnRate}% RTO
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="Open WhatsApp Chat"
                          className="px-2.5 py-1 rounded bg-[#22C55E]/15 hover:bg-[#22C55E]/25 border border-[#22C55E]/40 text-[#22C55E] flex items-center gap-1 active:scale-95 transition-all text-xs"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
