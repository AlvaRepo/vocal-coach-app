// shared/components/ui/badge.tsx

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-soul-magenta/20 text-soul-magenta hover:bg-soul-magenta/30",
        secondary:
          "border-transparent bg-soul-cyan/20 text-soul-cyan hover:bg-soul-cyan/30",
        destructive:
          "border-transparent bg-red-500/20 text-red-400 hover:bg-red-500/30",
        outline: "text-foreground border-white/20",
        success:
          "border-transparent bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30",
        warning:
          "border-transparent bg-amber-500/20 text-amber-400 hover:bg-amber-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
