import { useState, useMemo, useEffect } from 'react'
import { useForm, Controller, type SubmitHandler } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Mail, Lock, Eye, EyeOff, User, Camera } from 'lucide-react'

import { Field, FieldLabel, FieldDescription, FieldError, FieldContent, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useSignUp } from '@/shared/api/generated/authentication/authentication'

const MAX_FILE_SIZE = 2 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"]

function SignUp() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { mutate, isPending } = useSignUp()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const avatarSchema = z.any()
  .refine((files) => {
    if (!files || files.length === 0) return true;
    return files[0].size <= MAX_FILE_SIZE;
  }, t("auth.errors.fileSize"))
  .refine((files) => {
    if (!files || files.length === 0) return true;
    return ACCEPTED_IMAGE_TYPES.includes(files[0].type);
  }, t("auth.errors.fileType"));

  const schema = useMemo(() => z.object({
    email: z.string().email(t("auth.errors.invalidEmail")),
    password: z.string()
      .min(8, t("auth.errors.tooShort"))
      .regex(/[A-Z]/, t("auth.errors.uppercase"))
      .regex(/[a-z]/, t("auth.errors.lowercase"))
      .regex(/[0-9]/, t("auth.errors.number")),
    confirmPassword: z.string().min(1, t("auth.errors.confirmRequired")),
    fullName: z.string().min(1, t("auth.errors.required")),
    currencyCode: z.string().default("USD"),
    avatar: avatarSchema,
  }).refine((data) => data.password === data.confirmPassword, {
    message: t("auth.errors.mismatch"),
    path: ["confirmPassword"],
  }), [t])

  type FormFields = z.infer<typeof schema>

  const { register, control, handleSubmit, setError, watch, formState: { errors } } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: { currencyCode: 'UAH', email: '', fullName: '', password: '', confirmPassword: '' }
  })

  const avatarFile = watch("avatar")
  const previewUrl = useMemo(() => {
    if (avatarFile && avatarFile instanceof FileList && avatarFile.length > 0) {
      return URL.createObjectURL(avatarFile[0])
    }
    return null
  }, [avatarFile])

  const onSubmit: SubmitHandler<FormFields> = (values) => {
    mutate({
      data: {
        dto: {
          email: values.email,
          password: values.password,
          fullName: values.fullName,
          currencyCode: values.currencyCode,
        },
        avatar: values.avatar?.[0],
      }
    }, {
      onSuccess: () => {
        toast.success(t("auth.signUpSuccess"))
        setTimeout(() => navigate('/login'), 2000)
      },
      onError: (error: any) => {
        if (error?.response?.status === 409) {
          setError("email", { message: t("auth.emailExists") })
        } else {
          toast.error(t("common.error"))
        }
      }
    })
  }

  return (
    <div className='mt-20 max-w-[400px] mx-auto p-4'>
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold">{t("auth.title")}</h1>
        <p className="text-muted-foreground mt-2">{t("auth.subtitle")}</p>
        <p className="text-xs text-muted-foreground mt-1">{t("auth.requiredFields")}</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          {/* Email */}
          <Field data-invalid={!!errors.email}>
            <FieldLabel>Email *</FieldLabel>
            <FieldContent className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="pl-10" placeholder="name@example.com" {...register("email")} />
            </FieldContent>
            <FieldError>{errors.email?.message}</FieldError>
          </Field>

          <Field data-invalid={!!errors.password}>
            <FieldLabel>{t("auth.password")} *</FieldLabel>
            <FieldDescription>{t("auth.passwordRules")}</FieldDescription>
            <FieldContent className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                className="pl-10 pr-10"
                placeholder={t("auth.passwordPlaceholder")}
                {...register("password")}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </FieldContent>
            <FieldError>{errors.password?.message}</FieldError>
          </Field>

          <Field data-invalid={!!errors.confirmPassword}>
            <FieldLabel>{t("auth.confirmPassword")} *</FieldLabel>
            <FieldContent className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                className="pl-10 pr-10"
                placeholder={t("auth.confirmPassword")}
                {...register("confirmPassword")}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </FieldContent>
            <FieldError>{errors.confirmPassword?.message}</FieldError>
          </Field>

          <Field data-invalid={!!errors.fullName}>
            <FieldLabel>{t("auth.fullName")} *</FieldLabel>
            <FieldContent className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="pl-10" placeholder={t("auth.typeFullName")} {...register("fullName")} />
            </FieldContent>
            <FieldError>{errors.fullName?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel>{t("auth.currency")} *</FieldLabel>
            <Controller
              name="currencyCode"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("auth.currencyPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UAH">{t("auth.uah")} (₴)</SelectItem>
                    <SelectItem value="USD">{t("auth.usd")} ($)</SelectItem>
                    <SelectItem value="EUR">{t("auth.eur")} (€)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field data-invalid={!!errors.avatar}>
            <FieldLabel>{t("auth.avatar.label")}</FieldLabel>
            <div className="flex items-center gap-4 mt-2">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center border border-dashed overflow-hidden shadow-inner">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-1">
                <label className="cursor-pointer bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all">
                  <Camera className="w-4 h-4" />
                  {previewUrl ? t("auth.avatar.change") : t("auth.avatar.upload")}
                  <input type="file" className="hidden" accept="image/*" {...register("avatar")} />
                </label>
                <p className="text-[10px] text-muted-foreground">{t("auth.avatar.hint")}</p>
              </div>
            </div>
            <FieldError>{errors.avatar?.message?.toString()}</FieldError>
          </Field>
        </FieldGroup>

        <Button type="submit" className="w-full py-6 text-lg" disabled={isPending}>
          {isPending ? t("common.loading") : t("signUp")}
        </Button>
      </form>
    </div>
  )
}

export default SignUp