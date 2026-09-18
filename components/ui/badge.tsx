import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[#14B8A6] text-white hover:bg-[#14B8A6]/80",
        secondary: "border-transparent bg-[#1E293B] text-slate-100 hover:bg-[#1E293B]/80",
        destructive: "border-transparent bg-red-500 text-white hover:bg-red-500/80",
        outline: "text-slate-100 border-[#1E293B]/70",
        success: "border-transparent bg-[#10B981] text-white hover:bg-[#10B981]/80",
        warning: "border-transparent bg-[#F59E0B] text-white hover:bg-[#F59E0B]/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
