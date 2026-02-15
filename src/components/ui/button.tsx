import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary"
  isLoading?: boolean
  icon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = "primary", isLoading, icon, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "flex h-12.5 w-full items-center justify-center gap-3.5 rounded-[10px] border transition-all duration-200",
          "text-[16px] font-medium leading-[1.167] tracking-[-1.5px]",
          variant === "primary" && cn(
            "border-white/65",
            "bg-linear-to-b from-[rgba(49,95,85,0.55)] to-[rgba(49,95,85,0.18)]",
            "backdrop-blur-[7px] shadow-[0px_14px_26px_0px_rgba(0,0,0,0.35)]",
            "[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_14px_26px_0px_rgba(0,0,0,0.35)]",
            "text-[#eaf6f3]",
            "hover:opacity-90 active:opacity-80",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          ),
          variant === "secondary" && cn(
            "border-transparent bg-transparent",
            "text-[#02a078]",
            "hover:opacity-80 active:opacity-70",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          ),
          className
        )}
        {...props}
      >
        {children}
        {icon && <div className="shrink-0">{icon}</div>}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button }
