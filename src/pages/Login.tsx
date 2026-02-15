import { useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import { Mail, Lock, Eye, EyeOff, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

import moneyBg from "@/assets/money-bg.png"
import { useLogin } from "@/shared/api/generated/authentication/authentication"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field"

type LoginFormData = {
  email: string
  password: string
}

function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { mutate: loginMutate, isPending } = useLogin()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const loginSchema = useMemo(() => z.object({
    email: z.string().email({ message: t("login.errors.invalidEmail") }),
    password: z.string().min(1, t("login.errors.requiredPassword")),
  }), [t])

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  })

  const onSubmit = (data: LoginFormData) => {
    loginMutate(
      { data: { email: data.email, password: data.password } },
      {
        onSuccess: (response) => {
          if (response?.data && 'accessToken' in response.data && response.data.accessToken) {
            localStorage.setItem("accessToken", response.data.accessToken)
          }

          if (rememberMe) {
            localStorage.setItem("rememberMe", "true")
          }

          toast.success(t("login.success"))

          setTimeout(() => navigate("/"), 500)
        },
        onError: (error) => {
          if (error.status === 401) {
            setError("email", { message: t("login.errors.wrongCredentials") })
            setError("password", { message: t("login.errors.wrongCredentials") })
            toast.error(t("login.errors.wrongCredentials"))
          } else if (error.status === 403) {
            toast.error(t("login.errors.emailNotVerified"))
          } else {
            toast.error(error.detail || t("login.errors.loginError"))
          }
        },
      }
    )
  }

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-[#0b1514]">
      <div className="absolute -left-57.25 -top-98.75 flex h-371.75 w-341.25 items-center justify-center">
        <img
          src={moneyBg}
          alt=""
          className="h-309.25 w-206.25 rotate-33 object-cover opacity-20"
        />
      </div>

      <div className="absolute bottom-10 left-10 z-10 flex flex-col items-start justify-center rounded-[10px] px-5 py-4 backdrop-blur-lg shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_24px_64px_0px_rgba(0,0,0,0.2)]">
        <p className="text-[16px] leading-[1.167] text-[#eaf6f3]">
          {t("login.noAccount")}
        </p>
        <Link
          to="/signup"
          className="flex items-center gap-1.5 text-[24px] font-semibold leading-[1.167] tracking-[-1.5px] text-[#315e55] transition-colors hover:text-[#3d7568]"
        >
          {t("login.signUpLink")}
          <ChevronRight className="size-4" />
        </Link>
      </div>

      <div
        className={cn(
          "absolute right-40 top-0 flex h-full w-133.5 flex-col items-start justify-center gap-7 rounded-[10px] px-12.5",
          "border border-white/[0.14] backdrop-blur-lg",
          "bg-linear-to-b from-[rgba(11,21,20,0.03)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)]",
          "shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)]",
          "[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_24px_64px_0px_rgba(0,0,0,0.2)]"
        )}
      >
        <div className="flex flex-col gap-3.5">
          <h1 className="text-[34px] font-bold leading-[1.167] tracking-[-1.5px] text-[#eaf6f3]">
            {t("login.title")}
          </h1>
          <p className="text-[20px] font-medium leading-[1.167] text-[#bfd9d2]">
            {t("login.subtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-9">
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-col justify-between gap-4">
              <Field>
                <FieldLabel className="text-[16px] leading-[1.167] text-[#bfd9d2]">
                  {t("login.email")}
                </FieldLabel>
                <FieldContent>
                  <div
                    className={cn(
                      "flex h-10 items-center gap-2.5 rounded-[10px] border px-2.5 transition-colors",
                      "bg-linear-to-b from-[rgba(11,21,20,0.03)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)]",
                      errors.email
                        ? "border-[#ce0000]"
                        : "border-white/[0.14] focus-within:border-white/65"
                    )}
                  >
                    <Mail className="size-4 shrink-0 text-[#bfd9d2]" />
                    <Input
                      type="email"
                      placeholder={t("login.emailPlaceholder")}
                      className="border-0 bg-transparent p-0 text-[16px] leading-[1.167] text-[#eaf6f3] placeholder:text-[#bfd9d2] shadow-none focus-visible:ring-0"
                      aria-invalid={!!errors.email}
                      {...register("email")}
                    />
                  </div>
                  <FieldError className="text-[10px] leading-[1.167] text-[#ce0000]">
                    {errors.email?.message}
                  </FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel className="text-[16px] leading-[1.167] text-[#bfd9d2]">
                  {t("login.password")}
                </FieldLabel>
                <FieldContent>
                  <div className={cn("flex h-10 items-center gap-2.5 rounded-[10px] border px-2.5 mb-5 transition-colors",
                      "bg-linear-to-b from-[rgba(11,21,20,0.03)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)]",
                      errors.password
                        ? "border-[#ce0000]"
                        : "border-white/[0.14] focus-within:border-white/65")}
                  >
                    <Lock className="size-4 shrink-0 text-[#bfd9d2]" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={t("login.passwordPlaceholder")}
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
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className="flex items-center gap-2.5"
              >
                <span
                  className={cn(
                    "flex size-4.25 items-center justify-center rounded-full border border-[#bfd9d2] transition-colors",
                    rememberMe && "border-[#315e55] bg-[#315e55]"
                  )}
                >
                  {rememberMe && (
                    <span className="size-1.75 rounded-full bg-[#eaf6f3]" />
                  )}
                </span>
                <span className="text-[16px] leading-[1.167] text-[#eaf6f3]">
                  {t("login.rememberMe")}
                </span>
              </button>
              <Link
                to="/forgot-password"
                className="text-[16px] leading-[1.167] text-[#eaf6f3] transition-colors hover:text-[#bfd9d2]"
              >
                {t("login.forgotPassword")}
              </Link>
            </div>
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
            {isPending ? t("login.loading") : t("login.loginButton")}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
