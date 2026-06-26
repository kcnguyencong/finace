import React from "react"
import { cn } from "../../lib/utils"

function Badge({ className, variant = "default", ...props }) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-label-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2",
        {
          "bg-secondary/10 text-secondary": variant === "success",
          "bg-error/10 text-error": variant === "error",
          "bg-primary-container text-on-primary-container": variant === "default",
          "bg-surface-variant text-on-surface-variant": variant === "secondary",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
