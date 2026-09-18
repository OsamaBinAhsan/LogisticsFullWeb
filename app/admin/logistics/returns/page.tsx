"use client";

import React, { useState, useEffect } from "react";
import { logisticsOrdersService } from "@/lib/services/logistics-orders.service";
import { type Order } from "@/lib/validations/logistics-order.schema";
import { type GeographicRiskZone } from "@/types/logistics";
import { ScannerNav } from "@/components/logistics/layout/ScannerNav";
import { ReasonPillBar } from "@/components/logistics/returns/ReasonPillBar";
import { HeatmapGrid } from "@/components/logistics/returns/HeatmapGrid";
import { RtoRecoveryTable } from "@/components/logistics/returns/RtoRecoveryTable";
import { AlertOctagon, TrendingDown } from "lucide-react";

export default function ReturnsRadarPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [zones, setZones] = useState<GeographicRiskZone[]>([]);
  const [reasons, setReasons] = useState<
    { reason: string; key: string; percentage: number; count: number; color: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadReturnTelemetry() {
      try {
        const [ordersData, zonesData, reasonsData] = await Promise.all([
          logisticsOrdersService.getOrders(),
          logisticsOrdersService.getGeographicRiskZones(),
          logisticsOrdersService.getReturnReasonsSummary(),
        ]);
        setOrders(ordersData);
        setZones(zonesData);
        setReasons(reasonsData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadReturnTelemetry();
  }, []);

  const handleScheduleSecondAttempt = async (orderId: string, notes: string) => {
    const updated = await logisticsOrdersService.scheduleSecondAttempt(orderId, notes);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <ScannerNav />

      <div className="p-6 max-w-7xl w-full mx-auto space-y-6 flex-1">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="dyno-tape">TELEMETRY & RTO RADAR</span>
              <span className="text-xs font-mono text-razor-crimson font-bold flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5" />
                RETURN RATE: 5.8%
              </span>
            </div>
            <h1 className="font-headline text-2xl font-bold text-on-surface tracking-tight uppercase mt-1">
              RTO Return Reason Radar & Area Risk Heatmap
            </h1>
            <p className="text-xs text-on-surface-variant font-mono">
              Diagnostic risk analytics to prevent doorstep delivery rejections and fake orders.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1 rounded-full bg-surface-container border border-surface-container-high text-secondary font-bold flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              -2.1% vs Last Month
            </span>
          </div>
        </div>

        {/* Diagnostic Visualizer: Top Return Drivers */}
        {reasons.length > 0 && <ReasonPillBar reasons={reasons} />}

        {/* Actionable RTO Recovery Table */}
        <RtoRecoveryTable
          orders={orders}
          onScheduleAttempt={handleScheduleSecondAttempt}
        />

        {/* Geographic Delivery Zone Risk Heatmap */}
        {zones.length > 0 && <HeatmapGrid zones={zones} />}
      </div>
    </div>
  );
}
