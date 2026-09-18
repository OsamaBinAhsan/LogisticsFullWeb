import * as React from "react";
import { Badge } from "@/components/ui/badge";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusColorMap: Record<OrderStatus, string> = {
  pending: "bg-[#F59E0B] text-white hover:bg-[#F59E0B]/80 border-transparent",
  confirmed: "bg-[#3B82F6] text-white hover:bg-[#3B82F6]/80 border-transparent",
  processing: "bg-[#A855F7] text-white hover:bg-[#A855F7]/80 border-transparent",
  shipped: "bg-[#14B8A6] text-white hover:bg-[#14B8A6]/80 border-transparent",
  delivered: "bg-[#10B981] text-white hover:bg-[#10B981]/80 border-transparent",
  cancelled: "bg-red-500 text-white hover:bg-red-500/80 border-transparent",
  returned: "bg-orange-500 text-white hover:bg-orange-500/80 border-transparent",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const customClass = statusColorMap[status];

  return (
    <Badge className={`${customClass} ${className || ""}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
