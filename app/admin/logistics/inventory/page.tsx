"use client";

import React, { useState, useEffect } from "react";
import { logisticsInventoryService } from "@/lib/services/logistics-inventory.service";
import { type InventoryItem } from "@/types/logistics";
import { formatBDT } from "@/lib/utils";
import { ScannerNav } from "@/components/logistics/layout/ScannerNav";
import { useHapticAudio } from "@/lib/hooks/use-haptic-audio";
import {
  AlertTriangle,
  RefreshCw,
  Plus,
  Minus,
  Share2,
  ShoppingBag,
  MessageCircle,
  TrendingUp,
} from "lucide-react";

export default function InventorySyncPage() {
  const { playMechanicalClick, playLaserBeep } = useHapticAudio();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      const data = await logisticsInventoryService.getInventoryItems();
      setItems(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleStockAdjustment = async (sku: string, diff: number) => {
    playMechanicalClick();
    const updated = await logisticsInventoryService.updateStock(sku, diff);
    if (updated) {
      setItems((prev) => prev.map((i) => (i.sku === sku ? updated : i)));
    }
  };

  const categories = ["all", ...Array.from(new Set(items.map((i) => i.category)))];

  const filteredItems = items.filter((i) => {
    if (filterCategory === "all") return true;
    return i.category === filterCategory;
  });

  const lowStockItems = items.filter((i) => i.availableStock <= i.safetyThreshold);

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <ScannerNav />

      <div className="p-6 max-w-7xl w-full mx-auto space-y-6 flex-1">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="dyno-tape">STOCK CONTROLLER</span>
              <span className="text-xs font-mono text-zinc-400">
                MULTI-CHANNEL OMNI SYNC
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight font-mono uppercase mt-1">
              SKU Stock Sync & Safety Alerts
            </h1>
            <p className="text-xs text-zinc-400 font-mono">
              Live inventory reserved during packing to prevent multi-channel overselling.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-2.5 py-1 rounded bg-obsidian-card border border-obsidian-border text-emerald-400 flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Sync Active (Shopify, FB, WA)
            </span>
          </div>
        </div>

        {/* Safety Stock Alert Banner */}
        {lowStockItems.length > 0 && (
          <div className="p-4 rounded-xl bg-razor-crimson/10 border border-razor-crimson/40 flex items-center justify-between font-mono">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-razor-crimson/20 text-razor-crimson">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  Safety Threshold Alert ({lowStockItems.length} SKUs Critical)
                </div>
                <div className="text-xs text-zinc-400">
                  {lowStockItems.map((i) => i.sku).join(", ")} will stock out within 48h.
                </div>
              </div>
            </div>
            <button
              onClick={() => playLaserBeep()}
              className="px-3 py-1.5 rounded bg-razor-crimson hover:bg-razor-crimson/80 text-white text-xs font-bold active:scale-95 transition-all"
            >
              Generate PO
            </button>
          </div>
        )}

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-zinc-500 uppercase">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playMechanicalClick();
                setFilterCategory(cat);
              }}
              className={`px-3 py-1 rounded-md transition-all uppercase ${
                filterCategory === cat
                  ? "bg-hazard-amber text-black font-bold shadow-tactile"
                  : "bg-obsidian-card border border-obsidian-border text-zinc-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Inventory Matrix Table */}
        <div className="hardware-panel rounded-xl border border-obsidian-border overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-obsidian-border bg-obsidian-card/90 text-[11px] uppercase tracking-wider text-zinc-400">
                <th className="py-3 px-4">SKU & Item Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Synced Channels</th>
                <th className="py-3 px-4 text-right">Available Stock</th>
                <th className="py-3 px-4 text-right">Reserved in Dispatch</th>
                <th className="py-3 px-4 text-center">Velocity</th>
                <th className="py-3 px-4 text-right">Unit Value</th>
                <th className="py-3 px-4 text-right">Quick Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-border/50">
              {filteredItems.map((item) => {
                const isCritical = item.availableStock <= item.safetyThreshold;

                return (
                  <tr
                    key={item.sku}
                    className={`hover:bg-obsidian-hover/40 transition-colors ${
                      isCritical ? "bg-razor-crimson/5" : ""
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold text-zinc-200">
                      <div>{item.name}</div>
                      <div className="text-[10px] text-zinc-500">{item.sku}</div>
                    </td>
                    <td className="py-3 px-4 text-zinc-400">{item.category}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {item.channels.facebook && (
                          <span
                            title="Synced to Facebook Shop"
                            className="p-1 rounded bg-[#FF1493]/10 text-[#FF1493] border border-[#FF1493]/30"
                          >
                            <Share2 className="w-3 h-3" />
                          </span>
                        )}
                        {item.channels.shopify && (
                          <span
                            title="Synced to Shopify Store"
                            className="p-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30"
                          >
                            <ShoppingBag className="w-3 h-3" />
                          </span>
                        )}
                        {item.channels.whatsapp && (
                          <span
                            title="Synced to WhatsApp Catalog"
                            className="p-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          >
                            <MessageCircle className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`text-sm font-bold ${
                          isCritical ? "text-razor-crimson animate-pulse" : "text-white"
                        }`}
                      >
                        {item.availableStock}
                      </span>
                      <div className="text-[9px] text-zinc-500">
                        Safety: {item.safetyThreshold}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-zinc-400">
                      <span className="text-hazard-amber font-bold">
                        {item.reservedStock}
                      </span>{" "}
                      units
                    </td>
                    <td className="py-3 px-4 text-center text-zinc-400">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        <TrendingUp className="w-3 h-3 text-hyper-teal" />
                        <span>{item.reorderVelocityDays}d lead</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="text-white font-bold">
                        {formatBDT(item.retailPrice)}
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        Cost: {formatBDT(item.unitCost)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleStockAdjustment(item.sku, -1)}
                          className="p-1 rounded bg-obsidian-card hover:bg-obsidian-hover border border-obsidian-border text-zinc-400 hover:text-white active:scale-95"
                          title="Deduct 1"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleStockAdjustment(item.sku, 1)}
                          className="p-1 rounded bg-obsidian-card hover:bg-obsidian-hover border border-obsidian-border text-zinc-400 hover:text-white active:scale-95"
                          title="Add 1"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
