import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border-0 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        pink:   "bg-[#FDD0DE] text-[#7a2040]",
        yellow: "bg-[#FDEABC] text-[#7a5a10]",
        green:  "bg-[#DAEDE2] text-[#1e5c34]",
        blue:   "bg-[#D7DEF8] text-[#1e3270]",
        // behold disse for bakoverkompatibilitet
        default:     "bg-[#FDD0DE] text-[#7a2040]",
        secondary:   "bg-[#D7DEF8] text-[#1e3270]",
        destructive: "bg-[#FDD0DE] text-[#7a2040]",
        outline:     "bg-[#DAEDE2] text-[#1e5c34]",
      },
    },
    defaultVariants: {
      variant: "pink",
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
