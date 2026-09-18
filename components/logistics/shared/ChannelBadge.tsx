import React from "react";
import { type Channel } from "@/lib/validations/logistics-order.schema";
import { cn } from "@/lib/utils";
import { MessageCircle, ShoppingBag, Globe, Share2 } from "lucide-react";

interface ChannelBadgeProps {
  channel: Channel;
  className?: string;
  showIcon?: boolean;
}

export const ChannelBadge: React.FC<ChannelBadgeProps> = ({
  channel,
  className,
  showIcon = true,
}) => {
  switch (channel) {
    case "facebook":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider font-semibold bg-[#FF1493]/10 text-[#FF1493] border border-[#FF1493]/30 shadow-[0_0_8px_rgba(255,20,147,0.15)]",
            className
          )}
        >
          {showIcon && <Share2 className="w-3 h-3 shrink-0" />}
          FB Page
        </span>
      );
    case "instagram":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider font-semibold bg-[#FF1493]/10 text-[#FF1493] border border-[#FF1493]/30 shadow-[0_0_8px_rgba(255,20,147,0.15)]",
            className
          )}
        >
          {showIcon && <Share2 className="w-3 h-3 shrink-0" />}
          IG DM
        </span>
      );
    case "whatsapp":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider font-semibold bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]",
            className
          )}
          style={{ textShadow: "0 0 6px rgba(16, 185, 129, 0.4)" }}
        >
          {showIcon && <MessageCircle className="w-3 h-3 shrink-0" />}
          WhatsApp
        </span>
      );
    case "shopify":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider font-semibold bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30 shadow-[0_0_8px_rgba(59,130,246,0.15)]",
            className
          )}
        >
          {showIcon && <ShoppingBag className="w-3 h-3 shrink-0" />}
          Shopify
        </span>
      );
    case "custom_web":
    default:
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30",
            className
          )}
        >
          {showIcon && <Globe className="w-3 h-3 shrink-0" />}
          Direct Web
        </span>
      );
  }
};
