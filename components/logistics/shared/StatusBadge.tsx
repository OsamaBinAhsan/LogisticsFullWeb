"use client";

import React from "react";
import { motion } from "framer-motion";
import { type OrderStatus } from "@/lib/validations/logistics-order.schema";
import { cn } from "@/lib/utils";
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  XCircle,
} from "lucide-react";

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
  showIcon?: boolean;
}

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    bg: string;
    text: string;
    border: string;
    icon: React.ElementType;
    isPulse?: boolean;
    isRadarSweep?: boolean;
  }
> = {
  ready_to_pack: {
    label: "Ready to Pack",
    bg: "bg-hazard-amber/10",
    text: "text-hazard-amber",
    border: "border-hazard-amber/30",
    icon: Package,
  },
  awaiting_pickup: {
    label: "Awaiting Pickup",
    bg: "bg-hyper-teal/10",
    text: "text-hyper-teal",
    border: "border-hyper-teal/30",
    icon: Clock,
  },
  in_transit: {
    label: "In Transit",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/30",
    icon: Truck,
    isRadarSweep: true,
  },
  delivered: {
    label: "Delivered",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    icon: CheckCircle2,
  },
  delivery_failed: {
    label: "Delivery Failed",
    bg: "bg-razor-crimson/10",
    text: "text-razor-crimson",
    border: "border-razor-crimson/30",
    icon: AlertTriangle,
    isPulse: true,
  },
  rto_risk: {
    label: "High RTO Risk",
    bg: "bg-razor-crimson/20",
    text: "text-razor-crimson",
    border: "border-razor-crimson/50",
    icon: AlertTriangle,
    isPulse: true,
  },
  returned: {
    label: "Returned to Hub",
    bg: "bg-zinc-800/80",
    text: "text-zinc-400",
    border: "border-zinc-700",
    icon: RotateCcw,
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-zinc-800/60",
    text: "text-zinc-500",
    border: "border-zinc-800",
    icon: XCircle,
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  showIcon = true,
}) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.ready_to_pack;
  const Icon = cfg.icon;

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium border relative transition-colors",
        cfg.bg,
        cfg.text,
        cfg.border,
        className
      )}
    >
      {cfg.isRadarSweep && (
        <span className="w-1.5 h-1.5 rounded-full bg-hazard-amber animate-ping inline-block mr-0.5" />
      )}
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span className="tracking-tight">{cfg.label}</span>
    </motion.div>
  );
};
