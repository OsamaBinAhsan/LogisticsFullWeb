'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
import { logisticsOrdersService } from '@/lib/services/logistics-orders.service';
import type { PipelineMetrics } from '@/types/logistics';
import { formatUSD } from '@/lib/utils';
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
      badgeColor: 'bg-primary/10 text-primary border-primary/20',
      actionText: 'Launch Matrix',
    },
    {
      title: 'Batch Thermal Label Spooler',
      description: 'Zero-margin 4×6 Code 128 thermal labels with vector barcodes and recipient verification.',
      href: '/admin/logistics/labels/print',
      icon: Printer,
      badge: 'Print Hub',
      badgeColor: 'bg-secondary-container text-on-secondary-container border-secondary/20',
      actionText: 'Open Spooler',
    },
    {
      title: 'RTO Radar & Rescue Desk',
      description: 'Pre-emptive RTO interception, 2nd-attempt delivery scheduling, and geographic risk heatmaps.',
      href: '/admin/logistics/returns',
      icon: RotateCcw,
      badge: 'Risk Telemetry',
      badgeColor: 'bg-tertiary-container/15 text-tertiary border-tertiary/30',
      actionText: 'View Radar',
    },
    {
      title: 'Omni-Channel SKU Sync',
      description: 'Real-time reserved inventory deduction across Shopify, Facebook DM, and WhatsApp shops.',
      href: '/admin/logistics/inventory',
      icon: Layers,
      badge: 'Stock Guard',
      badgeColor: 'bg-primary-fixed text-on-primary-fixed-variant border-primary/20',
      actionText: 'Sync Inventory',
    },
    {
      title: 'Carrier Integration Hub',
      description: 'Carrier API credentials, real-time rate calculator, and automated dispatch corridor rules.',
      href: '/admin/logistics/settings/couriers',
      icon: Sliders,
      badge: '3 Gateways Active',
      badgeColor: 'bg-secondary-container text-on-secondary-container border-secondary/20',
      actionText: 'Configure Couriers',
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background text-on-surface">
      <ScannerNav />

      <div className="p-8 max-w-[1720px] w-full mx-auto space-y-8 flex-1">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-primary text-on-primary font-mono text-[10px] uppercase font-bold tracking-widest">
                AURA-MESH LOGISTICS
              </span>
              <span className="text-xs font-mono text-outline">
                ACTIVE WH: US-EAST-A (JFK)
              </span>
            </div>
            <h1 className="font-headline text-2xl md:text-3xl font-bold text-on-surface tracking-tight mt-1">
              Carrier Telemetry & Dispatch Engine
            </h1>
            <p className="text-xs text-on-surface-variant mt-1">
              External courier telemetry and autonomous flight corridors integrated with AuraCommerce consignments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/logistics/dispatch"
              className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary font-bold text-xs flex items-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <Boxes className="w-4 h-4" />
              <span>Go to Dispatch Matrix</span>
            </Link>
          </div>
        </div>

        {/* Operational Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-container-lowest rounded-3xl p-5 border border-surface-container shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-on-surface-variant font-bold">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                Ready to Pack
              </span>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            </div>
            <div className="text-3xl font-headline font-bold text-on-surface">
              {metrics ? metrics.readyToPackCount : '...'}
            </div>
            <div className="text-[11px] text-outline">
              Orders requiring consignment booking
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-3xl p-5 border border-surface-container shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-on-surface-variant font-bold">
              <span className="flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5 text-primary" />
                Manifested / Pickup
              </span>
              <span className="text-[10px] text-primary font-bold">Ready</span>
            </div>
            <div className="text-3xl font-headline font-bold text-on-surface">
              {metrics ? metrics.awaitingPickupCount : '...'}
            </div>
            <div className="text-[11px] text-outline">
              Labels generated, courier flight pending
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-3xl p-5 border border-surface-container shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-on-surface-variant font-bold">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-blue-500" />
                Active In-Transit
              </span>
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            </div>
            <div className="text-3xl font-headline font-bold text-on-surface">
              {metrics ? metrics.inTransitCount : '...'}
            </div>
            <div className="text-[11px] text-outline">
              {metrics ? `${metrics.deliverySuccessRate}% delivery SLA rate` : 'Tracking live'}
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-3xl p-5 border border-tertiary-container/40 space-y-2">
            <div className="flex items-center justify-between text-xs text-tertiary font-bold">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                RTO Return Risks
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold">
                Action
              </span>
            </div>
            <div className="text-3xl font-headline font-bold text-tertiary">
              {metrics ? metrics.rtoRiskCount : '...'}
            </div>
            <div className="text-[11px] text-tertiary/80">
              Requires immediate destination re-verification
            </div>
          </div>
        </div>

        {/* Core Subsystem Deep-Links Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Fulfillment Modules & Dedicated Workspaces
            </h2>
            <span className="text-xs text-outline font-mono">5 Integrated Subsystems</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featureCards.map((feat) => {
              const Icon = feat.icon;

              return (
                <Link
                  key={feat.href}
                  href={feat.href}
                  className="bg-surface-container-lowest rounded-3xl p-6 border border-surface-container hover:border-primary/40 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-surface-container-low border border-surface-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${feat.badgeColor}`}
                      >
                        {feat.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-headline text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                        {feat.title}
                      </h3>
                      <p className="font-body-sm text-xs text-on-surface-variant mt-1 leading-relaxed">
                        {feat.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-surface-container flex items-center justify-between text-xs text-primary font-bold">
                    <span>{feat.actionText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}

            {/* Quick Summary Telemetry Card */}
            <div className="bg-surface-container-lowest rounded-3xl p-6 border border-secondary-container/60 flex flex-col justify-between shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-secondary-container/20 border border-secondary-container/40 flex items-center justify-center text-secondary">
                    <Coins className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
                    Next-Day COD
                  </span>
                </div>

                <div>
                  <h3 className="font-headline text-base font-bold text-on-surface">
                    Pending COD Settlement
                  </h3>
                  <div className="text-2xl font-headline font-bold text-secondary mt-1">
                    {metrics ? formatUSD(metrics.codSettlementDue || 12450) : '$12,450.00'}
                  </div>
                  <p className="font-body-sm text-xs text-on-surface-variant mt-1">
                    Automatic reconciliation from integrated carrier statements.
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-surface-container flex items-center justify-between text-xs text-secondary font-bold">
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
