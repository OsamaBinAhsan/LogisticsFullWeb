"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { logisticsOrdersService } from "@/lib/services/logistics-orders.service";
import { type Order } from "@/lib/validations/logistics-order.schema";
import { ThermalLabelCard } from "@/components/logistics/labels/ThermalLabelCard";
import { useThermalPrint } from "@/lib/hooks/use-thermal-print";
import { useHapticAudio } from "@/lib/hooks/use-haptic-audio";
import {
  Printer,
  ArrowLeft,
  FileCheck,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

function ThermalPrintContent() {
  const searchParams = useSearchParams();
  const { playMechanicalClick, playLaserBeep } = useHapticAudio();
  const { selectedSize, setSelectedSize, triggerPrint, isPrinting } = useThermalPrint();

  const [ordersToPrint, setOrdersToPrint] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchOrders() {
      const idsParam = searchParams.get("ids");
      if (idsParam) {
        const ids = idsParam.split(",").map((s) => s.trim());
        const orders = await logisticsOrdersService.getOrdersByIds(ids);
        setOrdersToPrint(orders);
      } else {
        // Default to all ready to pack / manifested orders
        const all = await logisticsOrdersService.getOrders();
        setOrdersToPrint(all.slice(0, 4));
      }
      setIsLoading(false);
    }

    fetchOrders();
  }, [searchParams]);

  const handlePrint = () => {
    playLaserBeep();
    triggerPrint();
  };

  return (
    <div className="min-h-screen bg-obsidian text-zinc-200">
      {/* Non-Printable Hardware Control Bar */}
      <div className="no-print bg-obsidian border-b border-obsidian-border p-4 sticky top-0 z-30 shadow-xl backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/logistics/dispatch"
              onClick={playMechanicalClick}
              className="p-2 rounded-lg bg-obsidian-card hover:bg-obsidian-hover border border-obsidian-border text-zinc-400 hover:text-white transition-all active:scale-95 flex items-center gap-1.5 text-xs font-mono"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dispatch</span>
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <span className="dyno-tape">DIRECT THERMAL ENGINE</span>
                <span className="text-xs font-mono text-zinc-400">
                  {ordersToPrint.length} Labels Queued
                </span>
              </div>
              <h1 className="text-base font-bold text-white font-mono mt-0.5">
                Batch Thermal Label & Barcode Spooler
              </h1>
            </div>
          </div>

          {/* Controls: Size selector & Print button */}
          <div className="flex items-center gap-3">
            {/* Label Format Preset */}
            <div className="flex items-center gap-1 bg-obsidian-card p-1 rounded-lg border border-obsidian-border text-xs font-mono">
              <button
                onClick={() => {
                  playMechanicalClick();
                  setSelectedSize("4x6");
                }}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  selectedSize === "4x6"
                    ? "bg-hazard-amber text-black font-bold shadow-tactile"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                4&quot; x 6&quot; (Standard 100x150mm)
              </button>
              <button
                onClick={() => {
                  playMechanicalClick();
                  setSelectedSize("3x2");
                }}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  selectedSize === "3x2"
                    ? "bg-hazard-amber text-black font-bold shadow-tactile"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                3&quot; x 2&quot; (Compact)
              </button>
            </div>

            {/* Print Trigger Button */}
            <button
              onClick={handlePrint}
              disabled={isPrinting || ordersToPrint.length === 0}
              className="px-5 py-2 rounded-lg bg-hazard-amber hover:bg-hazard-amber-light text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-glow-amber active:scale-[0.97] transition-all disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              <span>Print All ({ordersToPrint.length})</span>
            </button>
          </div>
        </div>

        {/* Thermal Printer Calibration Hint */}
        <div className="max-w-6xl mx-auto mt-3 pt-3 border-t border-obsidian-border/60 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              Thermal Drivers: Compatible with Zebra ZD420, Xprinter XP-420B, Rollo, Dymo 4XL.
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span>Set Browser Print: Scale 100%, Margins: None</span>
          </div>
        </div>
      </div>

      {/* Label Sheet Previews */}
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 print:p-0 print:m-0 print:space-y-0">
        {isLoading ? (
          <div className="text-center py-20 text-zinc-500 font-mono text-sm">
            Preparing vector barcode sheets...
          </div>
        ) : ordersToPrint.length === 0 ? (
          <div className="hardware-panel p-12 text-center rounded-xl font-mono text-zinc-400">
            <FileCheck className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p>No orders selected for printing.</p>
            <Link
              href="/admin/logistics/dispatch"
              className="mt-3 inline-block px-4 py-1.5 rounded bg-hazard-amber text-black font-bold text-xs"
            >
              Select Orders on Dispatch Matrix
            </Link>
          </div>
        ) : (
          ordersToPrint.map((order) => (
            <div key={order.id} className="relative group">
              <div className="no-print mb-2 flex items-center justify-between text-xs font-mono text-zinc-500 max-w-[380px] mx-auto">
                <span>Label for: #{order.id}</span>
                <span>
                  Courier:{" "}
                  <strong className="text-zinc-300 uppercase">
                    {order.consignment?.courier || "Pending"}
                  </strong>
                </span>
              </div>
              <ThermalLabelCard order={order} size={selectedSize} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function ThermalPrintPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-obsidian flex items-center justify-center font-mono text-xs text-zinc-400">
          Loading Thermal Spooler...
        </div>
      }
    >
      <ThermalPrintContent />
    </Suspense>
  );
}
