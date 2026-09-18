'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Truck,
  Boxes,
  Printer,
  RotateCcw,
  Layers,
  Sliders,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Coins,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { logisticsOrdersService } from '@/lib/services/logistics-orders.service';
import type { PipelineMetrics } from '@/types/logistics';
import { formatBDT } from '@/lib/utils';
import { ScannerNav } from '@/components/logistics/layout/ScannerNav';

export default function LogisticsHubPage() {
  const [metrics, setMetrics] = useState<PipelineMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    logisticsOrdersService.getPipelineMetrics().then((data) => {
      setMetrics(data);
      setIsLoading(false);
    });
  }, []);

  const featureCards = [
    {
      title: 'Unified Dispatch Matrix',
      description: 'Point-and-shoot barcode scanning, automated courier routing, and bulk manifest creation.',
      href: '/admin/logistics/dispatch',
      icon: Boxes,
      badge: 'Core Engine',
      badgeColor: 'bg-hazard-amber/15 text-hazard-amber border-hazard-amber/30',
      actionText: 'Launch Matrix',
    },
    {
      title: 'Batch Thermal Label Spooler',
      description: 'Zero-margin 4x6 & 3x2 Code 128 thermal labels with vector barcodes and recipient verification.',
      href: '/admin/logistics/labels/print',
      icon: Printer,
      badge: 'Print Hub',
      badgeColor: 'bg-hyper-teal/15 text-hyper-teal border-hyper-teal/30',
      actionText: 'Open Spooler',
    },
    {
      title: 'RTO Radar & Rescue Desk',
      description: 'Pre-emptive RTO interception, 2nd-attempt delivery scheduling, and geographic risk heatmaps.',
      href: '/admin/logistics/returns',
      icon: RotateCcw,
      badge: 'Risk Telemetry',
      badgeColor: 'bg-razor-crimson/15 text-razor-crimson border-razor-crimson/30',
      actionText: 'View Radar',
    },
    {
      title: 'Omni-Channel SKU Sync',
      description: 'Real-time reserved inventory deduction across Shopify, Facebook DM, and WhatsApp shops.',
      href: '/admin/logistics/inventory',
      icon: Layers,
      badge: 'Stock Guard',
      badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      actionText: 'Sync Inventory',
    },
    {
      title: 'Courier Integration Hub',
      description: 'Steadfast, Pathao, and RedX API credentials, real-time rate calculator, and COD rules.',
      href: '/admin/logistics/settings/couriers',
      icon: Sliders,
      badge: '3 Gateways Active',
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      actionText: 'Configure Couriers',
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <ScannerNav />

      <div className="p-6 max-w-7xl w-full mx-auto space-y-8 flex-1">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="dyno-tape">FULFILLMENT COMMAND</span>
              <span className="text-xs font-mono text-zinc-500">
                ACTIVE WH: DHK-CENTRAL
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight font-mono uppercase mt-1">
              Logistics & Courier Orchestration Hub
            </h1>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              External courier telemetry engine integrated with AuraCommerce orders.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/logistics/dispatch"
              className="px-4 py-2 rounded-lg bg-hazard-amber hover:bg-hazard-amber-light text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-glow-amber active:scale-95 transition-all"
            >
              <Boxes className="w-4 h-4" />
              <span>Go to Dispatch Matrix</span>
            </Link>
          </div>
        </div>

        {/* Operational Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="hardware-panel rounded-xl p-4 border border-obsidian-border space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-hazard-amber" />
                Ready to Pack
              </span>
              <span className="w-2 h-2 rounded-full bg-hazard-amber animate-ping" />
            </div>
            <div className="text-3xl font-mono font-bold text-white">
              {metrics ? metrics.readyToPackCount : '...'}
            </div>
            <div className="text-[11px] font-mono text-zinc-500">
              Orders requiring consignment booking
            </div>
          </div>

          <div className="hardware-panel rounded-xl p-4 border border-obsidian-border space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5 text-hyper-teal" />
                Manifested / Pickup
              </span>
              <span className="text-[10px] text-hyper-teal font-mono">Ready</span>
            </div>
            <div className="text-3xl font-mono font-bold text-white">
              {metrics ? metrics.awaitingPickupCount : '...'}
            </div>
            <div className="text-[11px] font-mono text-zinc-500">
              Labels generated, rider pickup pending
            </div>
          </div>

          <div className="hardware-panel rounded-xl p-4 border border-obsidian-border space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-blue-400" />
                Active In-Transit
              </span>
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            </div>
            <div className="text-3xl font-mono font-bold text-white">
              {metrics ? metrics.inTransitCount : '...'}
            </div>
            <div className="text-[11px] font-mono text-zinc-500">
              {metrics ? `${metrics.deliverySuccessRate}% delivery SLA rate` : 'Tracking live'}
            </div>
          </div>

          <div className="hardware-panel rounded-xl p-4 border border-razor-crimson/40 bg-razor-crimson/5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-razor-crimson font-bold">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                RTO Return Risks
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-razor-crimson/20">
                Action
              </span>
            </div>
            <div className="text-3xl font-mono font-bold text-razor-crimson">
              {metrics ? metrics.rtoRiskCount : '...'}
            </div>
            <div className="text-[11px] font-mono text-razor-crimson/80">
              Requires immediate customer phone call
            </div>
          </div>
        </div>

        {/* Core Subsystem Deep-Links Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#14B8A6]" />
              Fulfillment Modules & Dedicated Workspaces
            </h2>
            <span className="text-xs font-mono text-zinc-500">5 Integrated Subsystems</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featureCards.map((feat) => {
              const Icon = feat.icon;

              return (
                <Link
                  key={feat.href}
                  href={feat.href}
                  className="hardware-panel rounded-xl p-5 border border-obsidian-border hover:border-[#14B8A6]/60 transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-obsidian-card border border-obsidian-border flex items-center justify-center text-[#14B8A6] group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${feat.badgeColor}`}
                      >
                        {feat.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white font-mono group-hover:text-[#14B8A6] transition-colors">
                        {feat.title}
                      </h3>
                      <p className="text-xs text-zinc-400 font-mono mt-1 leading-relaxed">
                        {feat.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-obsidian-border/60 flex items-center justify-between text-xs font-mono text-[#14B8A6] font-semibold">
                    <span>{feat.actionText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}

            {/* Quick Summary Telemetry Card */}
            <div className="hardware-panel rounded-xl p-5 border border-emerald-500/30 bg-emerald-500/5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Coins className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border bg-emerald-500/20 text-emerald-400 border-emerald-500/40">
                    Next-Day COD
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white font-mono">
                    Pending COD Settlement
                  </h3>
                  <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                    {metrics ? formatBDT(metrics.codSettlementDue) : '...'}
                  </div>
                  <p className="text-xs text-zinc-400 font-mono mt-1">
                    Automatic reconciliation from Steadfast & Pathao courier statements.
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-obsidian-border/60 flex items-center justify-between text-xs font-mono text-emerald-400">
                <span>Settlement Cycle: Active</span>
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
