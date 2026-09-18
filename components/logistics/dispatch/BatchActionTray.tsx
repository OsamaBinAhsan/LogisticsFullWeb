"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { springBounce } from "@/lib/motion";
import { useHapticAudio } from "@/lib/hooks/use-haptic-audio";
import { fireBatchConfetti } from "@/components/logistics/shared/ConfettiBurst";
import { type CourierName } from "@/lib/validations/logistics-order.schema";
import {
  Printer,
  Truck,
  CheckCheck,
  Send,
  Loader2,
  Layers,
  X,
} from "lucide-react";
import Link from "next/link";

interface BatchActionTrayProps {
  selectedCount: number;
  selectedOrderIds: string[];
  onBatchBook: (courier: CourierName) => Promise<void>;
  onMarkShipped: () => Promise<void>;
  onClearSelection: () => void;
}

export const BatchActionTray: React.FC<BatchActionTrayProps> = ({
  selectedCount,
  selectedOrderIds,
  onBatchBook,
  onMarkShipped,
  onClearSelection,
}) => {
  const { playMechanicalClick, playSuccessChime } = useHapticAudio();
  const [selectedCourier, setSelectedCourier] = useState<CourierName>("steadfast");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (selectedCount === 0) return null;

  const handleBatchDispatch = async () => {
    playMechanicalClick();
    setIsProcessing(true);
    try {
      await onBatchBook(selectedCourier);
      playSuccessChime();
      fireBatchConfetti();
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkShipped = async () => {
    playMechanicalClick();
    setIsProcessing(true);
    try {
      await onMarkShipped();
      playSuccessChime();
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 80, opacity: 0, scale: 0.95 }}
        transition={springBounce}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-auto min-w-[540px] max-w-2xl hardware-panel bg-obsidian/95 border border-hazard-amber/50 rounded-xl p-2.5 shadow-2xl backdrop-blur-xl"
      >
        <div className="flex items-center justify-between gap-4">
          {/* Left: Animated Counter Flip Badge */}
          <div className="flex items-center gap-2 pl-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-hazard-amber text-black font-mono font-bold text-xs">
              <Layers className="w-3.5 h-3.5" />
              <motion.span
                key={selectedCount}
                initial={{ scale: 1.4, y: -2 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              >
                {selectedCount}
              </motion.span>
              <span className="text-[10px] uppercase font-semibold">
                Selected
              </span>
            </div>

            <button
              onClick={onClearSelection}
              title="Clear selection"
              className="p-1 rounded text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Center: Courier Engine Dropdown Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-400 uppercase hidden sm:inline">
              Via:
            </span>
            <select
              value={selectedCourier}
              onChange={(e) => setSelectedCourier(e.target.value as CourierName)}
              className="bg-carbon border border-obsidian-border text-white text-xs font-mono px-2.5 py-1.5 rounded-md focus:border-hazard-amber focus:outline-none"
            >
              <option value="steadfast">Steadfast Courier</option>
              <option value="pathao">Pathao Express</option>
              <option value="redx">RedX Parcel</option>
            </select>
          </div>

          {/* Right: Actions (Batch Book, Print Labels, Mark Shipped) */}
          <div className="flex items-center gap-2">
            {/* Direct Print Labels (4x6) Link */}
            <Link
              href={`/admin/logistics/labels/print?ids=${selectedOrderIds.join(",")}`}
              onClick={playMechanicalClick}
              className="px-3 py-1.5 rounded-md bg-obsidian-card hover:bg-obsidian-hover border border-obsidian-border text-xs font-mono text-zinc-200 flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-hyper-teal" />
              <span className="hidden md:inline">Print 4x6</span>
            </Link>

            {/* Mark as Shipped */}
            <button
              onClick={handleMarkShipped}
              disabled={isProcessing}
              className="px-3 py-1.5 rounded-md bg-obsidian-card hover:bg-obsidian-hover border border-obsidian-border text-xs font-mono text-zinc-200 flex items-center gap-1.5 active:scale-95 transition-all disabled:opacity-50"
            >
              <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden md:inline">Shipped</span>
            </button>

            {/* Vibrant High-Energy Dispatch All Button */}
            <button
              onClick={handleBatchDispatch}
              disabled={isProcessing}
              className="relative group overflow-hidden px-4 py-1.5 rounded-md bg-gradient-to-r from-hazard-amber to-hazard-amber-light text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-glow-amber active:scale-[0.97] transition-all disabled:opacity-50"
            >
              <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                  Booking...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Dispatch All
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
