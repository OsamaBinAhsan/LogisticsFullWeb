"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface HeroVisualizerProps {
  imageSrc?: string;
  productName?: string;
  price?: number;
}

export function HeroVisualizer({
  imageSrc,
  productName = "Aura Signature Headphones",
  price = 15900,
}: HeroVisualizerProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-15, 15]);

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
      className="relative flex items-center justify-center w-full max-w-lg aspect-[4/5] perspective-[1000px] group cursor-pointer"
    >
      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.15)_0%,transparent_70%)] rounded-full blur-2xl group-hover:bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.25)_0%,transparent_70%)] transition-colors duration-500" />
      
      <motion.div
        style={{ rotateX, rotateY }}
        className="relative w-full h-full rounded-2xl border border-[#1E293B]/70 bg-[#0E121B]/85 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_20px_40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
      >
        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
          <Badge className="bg-[#10B981] text-white hover:bg-[#10B981]/90 shadow-lg border-none">Same-Day Dispatch</Badge>
          <Badge className="bg-[#14B8A6] text-white hover:bg-[#14B8A6]/90 shadow-lg border-none">Authentic Sourcing</Badge>
        </div>
        <div className="absolute top-4 right-4 z-20">
          <Badge className="bg-[#22C55E] text-white hover:bg-[#22C55E]/90 shadow-lg border-none flex items-center gap-1">
            WhatsApp Checkout
          </Badge>
        </div>

        {/* Product Image Area */}
        <div className="flex-1 flex items-center justify-center relative">
          {imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageSrc} alt={productName} className="w-3/4 object-contain drop-shadow-2xl z-10" />
          ) : (
            <div className="w-3/4 h-3/4 rounded-full bg-gradient-to-tr from-[#14B8A6] to-[#0E121B] blur-sm opacity-80 z-10 animate-pulse" />
          )}
        </div>

        {/* Info Area */}
        <div className="p-6 bg-[#06080A]/60 backdrop-blur-md border-t border-[#1E293B]/70 z-20">
          <h2 className="text-xl font-bold font-[Space_Grotesk] text-white mb-2">{productName}</h2>
          <p className="text-[#14B8A6] font-mono text-lg font-semibold">৳ {price.toLocaleString('en-BD')}</p>
        </div>
      </motion.div>
    </div>
  );
}
