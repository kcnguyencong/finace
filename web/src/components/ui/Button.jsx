import React from "react"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, variant = "primary", size = "default", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-[12px] text-label-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-primary text-on-primary hover:bg-primary/90 shadow-sm": variant === "primary",
          "bg-transparent text-primary border border-primary hover:bg-surface-container": variant === "secondary",
          "bg-transparent text-primary hover:bg-surface-container": variant === "ghost",
          "h-10 px-4 py-2": size === "default",
          "h-8 px-3 text-xs": size === "sm",
          "h-12 px-8": size === "lg",
          "h-10 w-10": size === "icon",
        },
        className
      )}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
