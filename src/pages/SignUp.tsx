import { useState, useMemo } from 'react'
import { useForm, Controller, type SubmitHandler } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Mail, Lock, User, Camera, ChevronRight } from 'lucide-react'

import { Field, FieldLabel, FieldDescription, FieldError, FieldContent, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import franklinLight from '@/assets/franklin-light.png'
import franklinDark from '@/assets/franklin-dark.png'
import { useTheme } from '@/shared/providers/ThemeProvider'
import { useSignUp } from '@/shared/api/generated/authentication/authentication'
import { type SignUpBody } from '@/shared/api/models'
import { cn } from '@/lib/utils'

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
];

function SignUp() {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { mutate, isPending } = useSignUp()
  const [isModal, setIsModal] = useState<Boolean>(false);

  const schema = useMemo(
    () =>
      z
        .object({
          email: z.string().email(t('auth.errors.invalidEmail')),
          password: z
            .string()
            .min(8, t('auth.errors.tooShort'))
            .regex(/[A-Z]/, t('auth.errors.uppercase'))
            .regex(/[a-z]/, t('auth.errors.lowercase'))
            .regex(/[0-9]/, t('auth.errors.number')),
          confirmPassword: z.string().min(1, t('auth.errors.confirmRequired')),
          fullName: z.string().min(1, t('auth.errors.required')),
          currencyCode: z.string(),
          avatar: z
            .any()
            .refine(
              files =>
                !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE,
              t('auth.errors.fileSize'),
            )
            .refine(
              files =>
                !files ||
                files.length === 0 ||
                ACCEPTED_IMAGE_TYPES.includes(files[0].type),
              t('auth.errors.fileType'),
            )
            .optional(),
        })
        .refine(data => data.password === data.confirmPassword, {
          message: t('auth.errors.mismatch'),
          path: ['confirmPassword'],
        }),
    [t],
  );

  type FormFields = z.infer<typeof schema>;

  const { register, control, handleSubmit, setError, watch, formState: { errors, isValid } } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: { 
      currencyCode: 'UAH', 
      email: '', 
      fullName: '', 
      password: '', 
      confirmPassword: '' 
    }
  })

  const previewUrl = useMemo(() => {
    if (avatarFile instanceof FileList && avatarFile.length > 0) {
      return URL.createObjectURL(avatarFile[0]);
    }
    return null;
  }, [avatarFile]);

  const onSubmit: SubmitHandler<FormFields> = values => {
    const payload: SignUpBody = {
      dto: {
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        currencyCode: values.currencyCode,
      },
      avatar: values.avatar?.[0],
    };

    mutate(
      { data: payload }, {
      onSuccess: () => {
        toast.success(t("auth.signUpSuccess"))
        setTimeout(() => setIsModal(true), 2000)
      },
    );
  };

  return (
    <div className={cn(
      'relative flex h-screen w-full items-center justify-center overflow-hidden bg-cover bg-no-repeat bg-center',
      theme === 'dark'
        ? "bg-[url('/src/assets/background.png')] bg-[#020f0c]"
        : 'bg-white'
    )}>
      <div
        className={cn(
          'absolute right-1/2 z-50 top-1/2 flex h-full w-[480px] -translate-y-1/2 flex-col items-start gap-[14px] rounded-[10px] px-[50px] py-[118px] overflow-y-auto',
          'border border-white/[0.14] backdrop-blur-lg',
          'bg-linear-to-b from-[rgba(11,21,20,0.03)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)]',
          'shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)]',
          '[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_24px_64px_0px_0_rgba(0,0,0,0.2)]'
        )}
      >
        <div className="flex flex-col">
          <div className='flex flex-col justify-between gap-[28px]'>
            
            <h1 className={cn('text-[34px] font-bold leading-[1.167] tracking-[-1.5px]', theme === 'dark' && 'text-[#eaf6f3]')}>
              {t('auth.title')}
            </h1>
            <div className={cn('flex flex-col justify-between gap-1.5', theme === 'dark' && 'text-[#bfd9d2]')}>
              <p className="text-[20px] font-medium leading-[1.167]">
                {t('auth.subtitle')}
              </p>
              <p className="text-[12px] leading-[1.3]">
                {t('auth.requiredFields')}
              </p>
            </div>
          </div>
        </div>

        <form className="flex w-full flex-col" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className='gap-0'>
            <Field data-invalid={!!errors.email}>
              <FieldLabel>Email *</FieldLabel>
              <FieldContent className="relative">
                <Input icon={<Mail className="size-4" />} placeholder="name@example.com" {...register('email')} />
              </FieldContent>
              <FieldError>{errors.email?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.password}>
              <FieldLabel>{t('auth.password')} *</FieldLabel>
              <FieldDescription className='text-[10px]'>{t('auth.passwordRules')}</FieldDescription>
              <FieldContent className="relative">
                <Input
                  variant="password"
                  icon={<Lock className="size-4" />}
                  placeholder={t('auth.passwordPlaceholder')}
                  {...register('password')}
                />
              <FieldError>{errors.password?.message}</FieldError>
              </FieldContent>
            </Field>

            <Field data-invalid={!!errors.confirmPassword}>
              <FieldLabel>{t('auth.confirmPassword')} *</FieldLabel>
              <FieldContent className="relative">
                <Input
                  variant="password"
                  icon={<Lock className="size-4" />}
                  placeholder={t('auth.confirmPassword')}
                  {...register('confirmPassword')}
                />
                <FieldError>{errors.confirmPassword?.message}</FieldError>
              </FieldContent>
            </Field>

            <Field data-invalid={!!errors.fullName}>
              <FieldLabel>{t('auth.fullName')} *</FieldLabel>
              <FieldContent className="relative">
                <Input
                  icon={<User className='size-4' />}
                  placeholder={t('auth.typeFullName')}
                  {...register('fullName')}
                />
              </FieldContent>
              <FieldError>{errors.fullName?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>{t('auth.currency')} *</FieldLabel>
              <Controller
                name="currencyCode"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('auth.currencyPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UAH">{t('auth.uah')} (₴)</SelectItem>
                      <SelectItem value="USD">{t('auth.usd')} ($)</SelectItem>
                      <SelectItem value="EUR">{t('auth.eur')} (€)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field data-invalid={!!errors.avatar}>
              <FieldLabel className='mb-0'>{t('auth.avatar.label')}</FieldLabel>
              <FieldContent>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-dashed bg-secondary shadow-inner">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div className="space-y-1">
                  <label className="flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90">
                    <Camera className="h-4 w-4" />
                    {previewUrl ? t('auth.avatar.change') : t('auth.avatar.upload')}
                    <input type="file" className="hidden" accept="image/*" {...register('avatar')} />
                  </label>
                  <p className="text-[10px] text-muted-foreground">{t('auth.avatar.hint')}</p>
                </div>
              </div>
              </FieldContent>
              <FieldError>{errors.avatar?.message?.toString()}</FieldError>
            </Field>
          </FieldGroup>

          <Button type="submit" className="w-full mt-[34px] py-6 text-lg" disabled={!isValid || isPending}>
            {isPending ? t('common.loading') : t('signUp')}
          </Button>
        </form>
      </div>

      <div className="pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 hidden lg:block">
        <img
          src={theme === 'dark' ? franklinDark : franklinLight}
          alt="Franklin"
          className="max-h-[480px] w-auto"
        />
      </div>

      <div className="absolute bottom-10 right-10 z-10 flex flex-col items-start justify-center rounded-[10px] px-5 py-4 backdrop-blur-lg shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_24px_64px_0px_rgba(0,0,0,0.2)]
                'border border-white/[0.14] backdrop-blur-lg',
                'bg-linear-to-b from-[rgba(11,21,20,0.03)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)]',
                'shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)]',
                '[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_24px_64px_0px_0_rgba(0,0,0,0.2)]'">
        <p className="text-[16px] leading-[1.167] text-[#eaf6f3]">
          {t('auth.haveAccount')}
        </p>
        <Link
          to="/login"
          className="flex items-center gap-1.5 text-[24px] font-semibold leading-[1.167] tracking-[-1.5px] text-[#315e55] transition-colors hover:text-[#3d7568]"
        >
          {t('auth.logInLink')}
          <ChevronRight className="size-4" />
        </Link>
      </div>

      {isModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="flex w-full max-w-md flex-col gap-6 rounded-xl border border-border p-8 shadow-lg bg-card text-card-foreground">
            <h2 className="text-2xl font-bold">{t('auth.verify.title')}</h2>
            <p className="text-muted-foreground">{t('auth.verify.message')}.</p>
            <Button className="w-full" onClick={() => navigate('/login')}>
              {t('auth.verify.button')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignUp;
