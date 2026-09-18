"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface HeroVisualizerProps {
  waybillId?: string;
  destination?: string;
  weight?: string;
}

export function HeroVisualizer({
  waybillId = "AC-88942-X",
  destination = "Narita Hub #4 ➔ LAX T4",
  weight = "1.84 kg",
}: HeroVisualizerProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [activeSensors, setActiveSensors] = React.useState({
    rfid: true,
    temp: "-4°C",
    seal: "Intact",
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 180, damping: 20 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-[4/5] max-w-md mx-auto perspective-[1000px] cursor-crosshair group select-none"
    >
      {/* Dynamic Ambient Glow Layers */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-secondary-fixed/25 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />

      <motion.div
        style={{ rotateX, rotateY }}
        className="relative w-full h-full rounded-2xl bg-surface-container-lowest border border-outline-variant/50 shadow-2xl p-6 flex flex-col justify-between overflow-hidden"
      >
        {/* Card Header */}
        <div className="flex items-center justify-between z-10">
          <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-sm text-xs font-bold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-primary">security</span>
            Tamper-Evident Kevlar Pod
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" />
            LIVE TELEMETRY
          </span>
        </div>

        {/* Central Visual: Holographic Freight Beacon */}
        <div className="relative flex-1 flex flex-col items-center justify-center py-6 z-10">
          {/* Concentric Radar Rings */}
          <div className="absolute w-44 h-44 rounded-full border border-primary/20 animate-ping opacity-30" />
          <div className="absolute w-36 h-36 rounded-full border border-primary/30" />
          <div className="absolute w-28 h-28 rounded-full border border-dashed border-outline-variant animate-spin [animation-duration:16s]" />

          {/* Core Parcel Icon Box */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary to-primary-container text-on-primary flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
            <span className="material-symbols-outlined text-[36px]">deployed_code</span>
          </div>

          <div className="text-center mt-5 space-y-1">
            <span className="font-label-sm text-[11px] uppercase tracking-widest text-outline font-bold">
              Consignment Waybill
            </span>
            <p className="font-headline text-2xl font-bold tracking-tight text-on-surface">
              #{waybillId}
            </p>
            <p className="font-body-sm text-xs text-on-surface-variant font-medium">
              {destination}
            </p>
          </div>
        </div>

        {/* Micro Sensor Readings Matrix */}
        <div className="grid grid-cols-3 gap-2 bg-surface-container-low p-3 rounded-xl z-10">
          <div className="text-left">
            <span className="font-label-sm text-[10px] uppercase text-outline block">Payload</span>
            <span className="font-headline text-sm font-bold text-on-surface">{weight}</span>
          </div>
          <div className="text-center">
            <span className="font-label-sm text-[10px] uppercase text-outline block">Cabin Temp</span>
            <span className="font-headline text-sm font-bold text-primary">{activeSensors.temp}</span>
          </div>
          <div className="text-right">
            <span className="font-label-sm text-[10px] uppercase text-outline block">Seal Status</span>
            <span className="font-headline text-sm font-bold text-secondary flex items-center justify-end gap-1">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              {activeSensors.seal}
            </span>
          </div>
        </div>

        {/* Card Footer Barcode & Speed SLA */}
        <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">qr_code_2</span>
            <span className="font-mono text-xs text-outline tracking-widest">RFID // 88204-A</span>
          </div>
          <span className="font-label-sm text-xs font-bold text-primary uppercase tracking-wide">
            Next Morning SLA
          </span>
        </div>
      </motion.div>
    </div>
  );
}
