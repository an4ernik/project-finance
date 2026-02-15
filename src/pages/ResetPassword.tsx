import { useState, useMemo, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import { Lock, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

import moneyBg from "@/assets/money-bg.png"
import { useResetPassword } from "@/shared/api/generated/authentication/authentication"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field"

type ResetPasswordFormData = {
  password: string
  confirmPassword: string
}

function ResetPassword() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { mutate: resetPassword, isPending } = useResetPassword()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) {
      toast.error(t("resetPassword.errors.tokenInvalid"))
      navigate("/login")
    }
  }, [token, navigate, t])

  const resetPasswordSchema = useMemo(() => z.object({
    password: z.string()
      .min(8, { message: t("auth.errors.tooShort") })
      .regex(/[A-Z]/, { message: t("auth.errors.uppercase") })
      .regex(/[a-z]/, { message: t("auth.errors.lowercase") })
      .regex(/[0-9]/, { message: t("auth.errors.number") }),
    confirmPassword: z.string().min(1, { message: t("auth.errors.confirmRequired") }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t("resetPassword.errors.mismatch"),
    path: ["confirmPassword"],
  }), [t])

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  })

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error(t("resetPassword.errors.tokenInvalid"))
      return
    }

    resetPassword(
      {
        data: {
          password: data.password,
          confirmPassword: data.confirmPassword,
        },
        params: { token }
      },
      {
        onSuccess: (response) => {
          if (response?.data && 'accessToken' in response.data && response.data.accessToken) {
            localStorage.setItem("accessToken", response.data.accessToken)
          }

          toast.success(t("resetPassword.success"))
          setTimeout(() => navigate("/"), 1500)
        },
        onError: (error) => {
          const status = 'status' in error ? error.status : null
          const detail = 'detail' in error ? error.detail : null

          if (status === 401 || status === 400) {
            toast.error(t("resetPassword.errors.tokenInvalid"))
            setTimeout(() => navigate("/login"), 2000)
          } else if (status === 409) {
            setError("password", { message: t("resetPassword.errors.invalidPassword") })
            toast.error(t("resetPassword.errors.invalidPassword"))
          } else {
            toast.error(detail || t("resetPassword.errors.resetError"))
          }
        },
      }
    )
  }

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-[#0b1514]">
      <div className="absolute -left-6.5 -top-64 flex h-355.25 w-425.5 items-center justify-center">
        <div className="flex-none rotate-180">
          <img
            src={moneyBg}
            alt=""
            className="h-355.25 w-425.5 object-cover opacity-20"
          />
        </div>
      </div>

      <div
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "flex w-171.75 flex-col items-start justify-center rounded-[10px] px-12.5 py-8",
          "border border-white/[0.14] backdrop-blur-lg",
          "bg-linear-to-b from-[rgba(11,21,20,0.03)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)]",
          "shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)]",
          "[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_24px_64px_0px_rgba(0,0,0,0.2)]"
        )}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-10.75">
          <div className="flex flex-col gap-9.5">
            <p className="text-[34px] font-bold leading-[1.167] tracking-[-1.5px] text-[#eaf6f3]">
              {t("resetPassword.title")}
            </p>
            <p className="text-[20px] font-medium leading-[1.167] text-[#bfd9d2] whitespace-pre-wrap">
              {t("resetPassword.subtitle")}
            </p>
          </div>

          <div className="flex w-full flex-col gap-0.5">
            <Field>
              <div className="flex items-center justify-between w-full">
                <FieldLabel className="text-[16px] leading-[1.167] text-[#bfd9d2]">
                  {t("resetPassword.newPassword")}
                </FieldLabel>
                <p className="text-[10px] leading-[1.167] text-[rgba(127,158,151,0.8)]">
                  {t("resetPassword.passwordRules")}
                </p>
              </div>
              <FieldContent>
                <div
                  className={cn(
                    "flex h-10 items-center gap-2.5 rounded-[10px] border px-2.5 backdrop-blur-[7px] transition-colors",
                    "bg-linear-to-b from-[rgba(11,21,20,0.03)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)]",
                    "shadow-[0px_14px_26px_0px_rgba(0,0,0,0.35)]",
                    "[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_14px_26px_0px_rgba(0,0,0,0.35)]",
                    errors.password
                      ? "border-[#ce0000]"
                      : "border-white/65"
                  )}
                >
                  <Lock className="size-4 shrink-0 text-[#bfd9d2]" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("resetPassword.newPasswordPlaceholder")}
                    className="border-0 bg-transparent p-0 text-[16px] leading-[1.167] text-[#eaf6f3] placeholder:text-[#bfd9d2] shadow-none focus-visible:ring-0"
                    aria-invalid={!!errors.password}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="shrink-0 text-[#bfd9d2] transition-colors hover:text-[#eaf6f3]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
                  </button>
                </div>
                <FieldError className="text-[10px] leading-[1.167] text-[#ce0000]">
                  {errors.password?.message}
                </FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel className="text-[16px] leading-[1.167] text-[#bfd9d2]">
                {t("resetPassword.confirmPassword")}
              </FieldLabel>
              <FieldContent>
                <div
                  className={cn(
                    "flex h-10 items-center gap-2.5 rounded-[10px] border px-2.5 backdrop-blur-[7px] transition-colors",
                    "bg-linear-to-b from-[rgba(11,21,20,0.03)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)]",
                    "shadow-[0px_14px_26px_0px_rgba(0,0,0,0.35)]",
                    "[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_14px_26px_0px_rgba(0,0,0,0.35)]",
                    errors.confirmPassword
                      ? "border-[#ce0000]"
                      : "border-white/65"
                  )}
                >
                  <Lock className="size-4 shrink-0 text-[#bfd9d2]" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t("resetPassword.confirmPasswordPlaceholder")}
                    className="border-0 bg-transparent p-0 text-[16px] leading-[1.167] text-[#eaf6f3] placeholder:text-[#bfd9d2] shadow-none focus-visible:ring-0"
                    aria-invalid={!!errors.confirmPassword}
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="shrink-0 text-[#bfd9d2] transition-colors hover:text-[#eaf6f3]"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
                  </button>
                </div>
                <FieldError className="text-[10px] leading-[1.167] text-[#ce0000]">
                  {errors.confirmPassword?.message}
                </FieldError>
              </FieldContent>
            </Field>
          </div>

          <button
            type="submit"
            disabled={isPending || !isValid}
            className={cn(
              "flex h-12.5 w-full items-center justify-center gap-3.5 rounded-[10px] border border-white/65",
              "bg-linear-to-b from-[rgba(49,95,85,0.55)] to-[rgba(49,95,85,0.18)]",
              "backdrop-blur-[7px] shadow-[0px_14px_26px_0px_rgba(0,0,0,0.35)]",
              "[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_14px_26px_0px_rgba(0,0,0,0.35)]",
              "text-[16px] font-medium leading-[1.167] tracking-[-1.5px] text-[#eaf6f3]",
              "cursor-pointer transition-opacity hover:opacity-90",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isPending ? t("resetPassword.loading") : t("resetPassword.updateButton")}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
