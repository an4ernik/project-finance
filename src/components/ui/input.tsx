import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  error?: boolean
  errorMessage?: string
  label?: string
  variant?: "text" | "password"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, error, errorMessage, label, variant = "text", type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const isPassword = variant === "password"
    const inputType = isPassword ? (showPassword ? "text" : "password") : type

    return (
      <div className="flex flex-col gap-1.5 items-start h-16">
        {label && (
          <label className="text-[16px] leading-[1.167] text-[#bfd9d2]">
            {label}
          </label>
        )}
        <div className="flex w-full flex-col gap-1.25">
          <div
            className={cn(
              "flex h-10 items-center gap-2.5 rounded-[10px] border px-2.5 transition-all duration-200",
              "bg-linear-to-b from-[rgba(11,21,20,0.03)] from-[1.442%] via-[rgba(49,95,85,0.1)] via-[50.481%] to-[rgba(144,208,182,0.05)] to-[94.712%]",
              isPassword && "backdrop-blur-[7px] shadow-[0px_14px_26px_0px_rgba(0,0,0,0.35)] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_14px_26px_0px_rgba(0,0,0,0.35)]",
              error
                ? "border-[#ce0000]"
                : isPassword
                ? "border-white/65"
                : cn(
                    "border-white/[0.14]",
                    "hover:border-[#bfd9d2] hover:shadow-[0px_4px_4px_0px_rgba(75,75,75,0.35)] hover:backdrop-blur-[7px] hover:[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.35)]",
                    "focus-within:border-[#02a078] focus-within:backdrop-blur-[7px]"
                  )
            )}
          >
            {icon && <div className="shrink-0 text-[#bfd9d2]">{icon}</div>}
            <input
              ref={ref}
              type={inputType}
              className={cn(
                "h-full w-full flex-1 bg-transparent text-[16px] leading-[1.167] text-[#eaf6f3] placeholder:text-[#bfd9d2]",
                "border-0 p-0 outline-none ring-0 focus:outline-none focus:ring-0",
                className
              )}
              {...props}
            />
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="shrink-0 text-[#bfd9d2] transition-colors hover:text-[#eaf6f3]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
              </button>
            )}
          </div>
          {errorMessage && (
            <p className="text-[10px] leading-[1.167] text-[#ce0000] min-h-2.75">
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }
