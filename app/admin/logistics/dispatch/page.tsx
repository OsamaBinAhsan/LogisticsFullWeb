"use client";

import React, { useState, useEffect, useCallback } from "react";
import { logisticsOrdersService } from "@/lib/services/logistics-orders.service";
import { type Order, type CourierName } from "@/lib/validations/logistics-order.schema";
import { type PipelineMetrics } from "@/types/logistics";
import { ScannerNav } from "@/components/logistics/layout/ScannerNav";
import { DispatchMetrics } from "@/components/logistics/dispatch/DispatchMetrics";
import { DispatchTable } from "@/components/logistics/dispatch/DispatchTable";
import { BatchActionTray } from "@/components/logistics/dispatch/BatchActionTray";
import { QuickBookingModal } from "@/components/logistics/dispatch/QuickBookingModal";
import { useScannerListener } from "@/lib/hooks/use-scanner-listener";
import { useHapticAudio } from "@/lib/hooks/use-haptic-audio";

export default function DispatchBoardPage() {
  const { playLaserBeep, playSuccessChime } = useHapticAudio();

  const [orders, setOrders] = useState<Order[]>([]);
  const [metrics, setMetrics] = useState<PipelineMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Table selection state
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  // Barcode scanner state
  const [scannedOrderId, setScannedOrderId] = useState<string | null>(null);

  // Quick booking modal state
  const [activeBookingOrder, setActiveBookingOrder] = useState<Order | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);

  // Load initial orders and metrics
  const loadData = useCallback(async () => {
    try {
      const [orderList, pipelineMetrics] = await Promise.all([
        logisticsOrdersService.getOrders(),
        logisticsOrdersService.getPipelineMetrics(),
      ]);
      setOrders(orderList);
      setMetrics(pipelineMetrics);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle hardware barcode scanner detection
  const handleHardwareScan = useCallback(
    (barcode: string) => {
      playLaserBeep();
      const cleanCode = barcode.trim().toUpperCase();

      // Look up order matching ID or tracking code
      const targetOrder = orders.find(
        (o) =>
          o.id.toUpperCase() === cleanCode ||
          (o.consignment?.trackingCode &&
            o.consignment.trackingCode.toUpperCase() === cleanCode)
      );

      if (targetOrder) {
        setScannedOrderId(targetOrder.id);
        setActiveBookingOrder(targetOrder);
        setIsBookingModalOpen(true);

        // Auto-select the scanned row
        setSelectedOrderIds((prev) =>
          prev.includes(targetOrder.id) ? prev : [...prev, targetOrder.id]
        );
      } else {
        // Flash unknown scan notification or highlight first matching order
        const fallback = orders[0];
        if (fallback) {
          setScannedOrderId(fallback.id);
          setActiveBookingOrder(fallback);
          setIsBookingModalOpen(true);
        }
      }
    },
    [orders, playLaserBeep]
  );

  // Activate hardware scanner listener
  useScannerListener({
    onScan: handleHardwareScan,
  });

  // Batch booking handler
  const handleBatchBook = async (courier: CourierName) => {
    if (selectedOrderIds.length === 0) return;
    await logisticsOrdersService.batchBookConsignments(selectedOrderIds, courier);
    await loadData();
    playSuccessChime();
    setSelectedOrderIds([]);
  };

  // Mark selected as shipped
  const handleMarkShipped = async () => {
    if (selectedOrderIds.length === 0) return;
    await logisticsOrdersService.markAsShipped(selectedOrderIds);
    await loadData();
    playSuccessChime();
    setSelectedOrderIds([]);
  };

  // Single order booking completion
  const handleBookingComplete = (orderId: string, updatedOrder: Order) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));
    logisticsOrdersService.getPipelineMetrics().then(setMetrics);
  };

  // Selection handlers
  const handleToggleSelectOrder = (orderId: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const handleSelectAllVisible = (orderIds: string[]) => {
    setSelectedOrderIds(orderIds);
  };

  const handleClearSelection = () => {
    setSelectedOrderIds([]);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <ScannerNav onSimulateScan={handleHardwareScan} />

      <div className="p-6 max-w-7xl w-full mx-auto space-y-6 flex-1">
        {/* Page Title & Operational Hub Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="dyno-tape">LIVE PIPELINE</span>
              <span className="text-xs font-mono text-zinc-500">
                AUTO-SYNC: 30S
              </span>
            </div>
            <h1 className="text-2xl font-bold text-on-surface tracking-tight font-headline uppercase mt-1">
              Unified Dispatch Matrix
            </h1>
            <p className="text-xs text-on-surface-variant font-mono">
              Consolidated orders from Facebook Live, IG Shop, WhatsApp Direct, & Shopify.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-2.5 py-1 rounded-full bg-surface-container border border-surface-container-high text-on-surface-variant">
              Active Courier: <span className="text-secondary font-bold">Steadfast</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-surface-container border border-surface-container-high text-on-surface-variant">
              Scanner Gun: <span className="text-primary font-bold">READY</span>
            </span>
          </div>
        </div>

        {/* Top Pipeline Diagnostic Metrics */}
        {metrics && <DispatchMetrics metrics={metrics} />}

        {/* TanStack Table Matrix */}
        <DispatchTable
          orders={orders}
          scannedOrderId={scannedOrderId}
          onSelectOrderToBook={(order) => {
            setActiveBookingOrder(order);
            setIsBookingModalOpen(true);
          }}
          selectedOrderIds={selectedOrderIds}
          onToggleSelectOrder={handleToggleSelectOrder}
          onSelectAllVisible={handleSelectAllVisible}
          onClearSelection={handleClearSelection}
        />

        {/* Floating Batch Action Dock with Elastic Overshoot */}
        <BatchActionTray
          selectedCount={selectedOrderIds.length}
          selectedOrderIds={selectedOrderIds}
          onBatchBook={handleBatchBook}
          onMarkShipped={handleMarkShipped}
          onClearSelection={handleClearSelection}
        />

        {/* Slide-over Consignment Booking Modal */}
        <QuickBookingModal
          order={activeBookingOrder}
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setActiveBookingOrder(null);
          }}
          onBookingComplete={handleBookingComplete}
        />
      </div>
    </div>
  );
}
