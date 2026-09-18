"use client";

import React, { useState } from "react";
import { ScanBarcode, Sparkles, Terminal, Bell } from "lucide-react";
import { AudioToggle } from "@/components/logistics/shared/AudioToggle";
import { useHapticAudio } from "@/lib/hooks/use-haptic-audio";

interface ScannerNavProps {
  onSimulateScan?: (barcode: string) => void;
}

export const ScannerNav: React.FC<ScannerNavProps> = ({ onSimulateScan }) => {
  const [manualCode, setManualCode] = useState("");
  const { playLaserBeep } = useHapticAudio();

  const handleManualScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    playLaserBeep();
    if (onSimulateScan) {
      onSimulateScan(manualCode.trim());
    }
    setManualCode("");
  };

  const triggerSampleScan = (code: string) => {
    playLaserBeep();
    if (onSimulateScan) {
      onSimulateScan(code);
    }
  };

  return (
    <header className="h-14 border-b border-obsidian-border bg-obsidian/90 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Hardware Scanner Input Emulation Deck */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <form
            onSubmit={handleManualScanSubmit}
            className="relative flex items-center"
          >
            <div className="absolute left-2.5 text-zinc-500 flex items-center pointer-events-none">
              <ScanBarcode className="w-4 h-4 text-hyper-teal animate-pulse" />
            </div>
            <input
              type="text"
              data-scanner-input="true"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Laser Scanner Active // Point & Scan Barcode..."
              className="bg-carbon border border-obsidian-border focus:border-hyper-teal text-zinc-200 text-xs font-mono pl-8 pr-20 py-1.5 rounded-md w-72 md:w-96 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-hyper-teal/30 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1 px-2 py-0.5 text-[10px] font-mono bg-obsidian-card hover:bg-obsidian-hover border border-obsidian-border text-zinc-300 rounded active:scale-95 transition-all"
            >
              ENTER ↵
            </button>
          </form>

          {/* Quick Hardware Simulator Triggers */}
          <div className="hidden lg:flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-zinc-600 uppercase">
              Quick Test:
            </span>
            <button
              onClick={() => triggerSampleScan("PP-8401")}
              className="px-2 py-1 rounded text-[10px] font-mono bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-hazard-amber hover:border-hazard-amber/40 active:scale-95 transition-all flex items-center gap-1"
            >
              <Sparkles className="w-2.5 h-2.5" />
              #PP-8401
            </button>
            <button
              onClick={() => triggerSampleScan("PP-8405")}
              className="px-2 py-1 rounded text-[10px] font-mono bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-razor-crimson hover:border-razor-crimson/40 active:scale-95 transition-all"
            >
              #PP-8405 (RTO)
            </button>
          </div>
        </div>
      </div>

      {/* Right: Sound Toggle, Hardware Hub Tag, Notifications */}
      <div className="flex items-center gap-3">
        <AudioToggle />

        <div className="hidden md:flex items-center gap-2 border-l border-obsidian-border pl-3 text-xs font-mono text-zinc-400">
          <Terminal className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-[11px] text-zinc-400">
            WH: <span className="text-white font-semibold">DHAKA-CENTRAL</span>
          </span>
        </div>

        <div className="w-8 h-8 rounded-full bg-obsidian-card border border-obsidian-border flex items-center justify-center relative">
          <Bell className="w-3.5 h-3.5 text-zinc-400" />
          <span className="w-2 h-2 rounded-full bg-hazard-amber absolute top-1.5 right-1.5" />
        </div>
      </div>
    </header>
  );
};
