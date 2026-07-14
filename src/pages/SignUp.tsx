import {useState, useMemo, useEffect, useRef} from 'react';
import {
  useForm,
  Controller,
  useWatch,
  type SubmitHandler,
} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {Link, useNavigate} from 'react-router-dom';
import {toast} from 'sonner';
import {Mail, Lock, User, Camera, ArrowRight} from 'lucide-react';

import {
  Field,
  FieldLabel,
  FieldError,
  FieldContent,
  FieldGroup,
} from '@/components/ui/field';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import franklinLight from '@/assets/franklin-light.png';
import franklinDark from '@/assets/franklin-dark.png';
import {useTheme} from '@/shared/providers/ThemeProvider';
import {useSignUp} from '@/shared/api/generated/authentication/authentication';
import {AuthRequestDTOCurrencyCode} from '@/shared/api/models/authRequestDTOCurrencyCode';
import {type SignUpBody} from '@/shared/api/models';
import {cn} from '@/lib/utils';
import i18n from '@/i18n';
import {
  useSetCurrencySign,
  type CurrencyCode,
} from '@/shared/store/useCurrencySign';

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
];

function SignUp() {
  const {theme} = useTheme();
  const setCurrencySign = useSetCurrencySign();
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {mutate, isPending} = useSignUp();
  const [isModal, setIsModal] = useState<boolean>(false);

  const schema = useMemo(
    () =>
      z
        .object({
          email: z.string().email(t('auth.errors.invalidEmail')),
          password: z
            .string()
            .min(8, t('auth.errors.tooShort'))
            .max(72, t('auth.errors.tooLong'))
            .regex(/^\S*$/, t('auth.errors.space'))
            .regex(/^[a-zA-Z0-9!@#$%^&*._\-+=?]*$/, t('auth.errors.latinOnly'))
            .regex(/[!@#$%^&*._\-+=?]/, t('auth.errors.symbol'))
            .regex(/[A-Z]/, t('auth.errors.uppercase'))
            .regex(/[a-z]/, t('auth.errors.lowercase'))
            .regex(/[0-9]/, t('auth.errors.number')),
          confirmPassword: z.string().min(1, t('auth.errors.confirmRequired')),
          fullName: z
            .string()
            .nonempty({message: t('auth.errors.required')})
            .min(3, t('auth.errors.fullNameLength'))
            .max(35, t('auth.errors.fullNameLength'))
            .regex(/^[A-Za-zА-Яа-яЁёІіЇїЄє\s'’ʼ]+$/, {
              message: t('auth.errors.fullNameLength'),
            }),
          currencyCode: z.string(),
          avatar: z
            .custom<FileList | undefined>()
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

  const {
    register,
    control,
    handleSubmit,
    setError,
    trigger,
    formState: {errors, isValid},
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues: {
      currencyCode: 'UAH',
      email: '',
      fullName: '',
      password: '',
      confirmPassword: '',
    },
  });

  const avatarFile = useWatch({
    control,
    name: 'avatar',
  });

  const previewUrl = useMemo(() => {
    if (avatarFile instanceof FileList && avatarFile.length > 0) {
      return URL.createObjectURL(avatarFile[0]);
    }
    return null;
  }, [avatarFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const previousLanguage = useRef(i18n.language);

  useEffect(() => {
    if (previousLanguage.current === i18n.language) return;
    previousLanguage.current = i18n.language;
    const fieldsWithErrors = Object.keys(errors) as Array<keyof FormFields>;
    if (fieldsWithErrors.length > 0) {
      void trigger(fieldsWithErrors);
    }
  }, [errors, trigger]);

  const onSubmit: SubmitHandler<FormFields> = values => {
    const payload: SignUpBody = {
      dto: {
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        currencyCode: values.currencyCode as AuthRequestDTOCurrencyCode,
      },
      avatar: values.avatar?.[0],
    };

    mutate(
      {data: payload},
      {
        onSuccess: () => {
          setCurrencySign(values.currencyCode as CurrencyCode);
          toast.success(t('auth.signUpSuccess'));
          setTimeout(() => setIsModal(true), 2000);
        },
        onError: (error: unknown) => {
          if (
            typeof error === 'object' &&
            error !== null &&
            'response' in error &&
            (error as {response?: {status?: number}}).response?.status === 409
          ) {
            setError('email', {message: t('auth.emailExists')});
            toast.error(t('auth.emailExists'));
          } else {
            toast.error(t('common.error'));
          }
        },
      },
    );
  };

  const backgroundImageSrc = theme === 'dark' ? franklinDark : franklinLight;

  return (
    <div className="flex h-screen w-full items-center justify-center dark:bg-radial-fade overflow-hidden">
      <div
        className={cn(
          'relative flex h-screen w-full items-center justify-center max-w-[2060px] mx-auto overflow-hidden',
        )}
      >
        <img
          src={backgroundImageSrc}
          alt="background"
          className="absolute top-1/2  transform -translate-y-1/2 right-0 h-[450px] w-fit object-cover xl:mr-[180px]"
        />
        {/* signup form */}
        <div
          className={cn(
            'scrollbar-hide static sm:absolute flex flex-col justify-start h-full min-h-0 overflow-y-auto md:left-0 mx-4 md:ml-[100px] lg:ml-[150px] xl:ml-[350px] overflow-y-auto z-50 w-full  max-w-134 items-start gap-3.5 rounded-[10px] px-4 sm:px-[50px] py-8 h-full',
            'border border-white/[0.14] backdrop-blur-lg',
            'bg-linear-to-b from-[rgba(11,21,20,0.03)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)]',
            'shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)]',
            '[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_24px_64px_0px_0_rgba(0,0,0,0.2)]',
          )}
        >
          <div className="flex flex-col mt-10">
            <div className="flex flex-col justify-between gap-7">
              <h1 className="text-[34px] font-bold leading-[1.167] tracking-[-1.5px] text-foreground">
                {t('auth.title')}
              </h1>
              <div className="flex flex-col justify-between gap-1.5 text-muted-foreground">
                <p className="text-[20px] font-medium leading-[1.167]">
                  {t('auth.subtitle')}
                </p>
                <p className="text-[12px] leading-[1.3]">
                  {t('auth.requiredFields')}
                </p>
              </div>
            </div>
          </div>

          <form
            className="flex w-full flex-col gap-3"
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
          >
            <FieldGroup className="gap-1.5">
              <Field className="gap-0.5" data-invalid={!!errors.email}>
                <FieldLabel>Email *</FieldLabel>
                <FieldContent className="relative gap-1">
                  <Input
                    icon={<Mail className="size-4" />}
                    placeholder="name@example.com"
                    errorMessage={errors.email?.message}
                    autoComplete="off"
                    {...register('email')}
                  />
                </FieldContent>
              </Field>

              <Field className="gap-0.5" data-invalid={!!errors.password}>
                <div className="flex items-end justify-between gap-2 flex-wrap">
                  <FieldLabel className="mb-0 flex-wrap">
                    {t('auth.password')} *
                  </FieldLabel>
                  <p className="text-[10px] leading-[1.2] text-muted-foreground sm:text-right">
                    {t('auth.passwordRules')}
                  </p>
                </div>
                <FieldContent className="relative gap-1">
                  <Input
                    variant="password"
                    icon={<Lock className="size-4" />}
                    placeholder={t('auth.passwordPlaceholder')}
                    errorMessage={errors.password?.message}
                    autoComplete="new-password"
                    {...register('password')}
                  />
                </FieldContent>
              </Field>

              <Field
                className="gap-0.5"
                data-invalid={!!errors.confirmPassword}
              >
                <FieldLabel>{t('auth.confirmPassword')} *</FieldLabel>
                <FieldContent className="relative gap-1">
                  <Input
                    variant="password"
                    icon={<Lock className="size-4" />}
                    placeholder={t('auth.confirmPassword')}
                    errorMessage={errors.confirmPassword?.message}
                    autoComplete="new-password"
                    {...register('confirmPassword')}
                  />
                </FieldContent>
              </Field>

              <Field className="gap-0.5" data-invalid={!!errors.fullName}>
                <FieldLabel>{t('auth.fullName')} *</FieldLabel>
                <FieldContent className="relative gap-1">
                  <Input
                    icon={<User className="size-4" />}
                    placeholder={t('auth.typeFullName')}
                    errorMessage={errors.fullName?.message}
                    {...register('fullName')}
                  />
                </FieldContent>
              </Field>

              <Field className="gap-0.5">
                <FieldLabel>{t('auth.currency')} *</FieldLabel>
                <Controller
                  name="currencyCode"
                  control={control}
                  render={({field}) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t('auth.currencyPlaceholder')}
                        />
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

              <Field className="gap-0.5" data-invalid={!!errors.avatar}>
                <FieldLabel className="mb-0">
                  {t('auth.avatar.label')}
                </FieldLabel>
                <FieldContent className="gap-1">
                  <div className="mt-1.5 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-dashed bg-secondary shadow-inner">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90">
                        <Camera className="h-4 w-4" />
                        {previewUrl
                          ? t('auth.avatar.change')
                          : t('auth.avatar.upload')}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg, image/gif, image/png, image/jpg"
                          {...register('avatar')}
                        />
                      </label>
                      <p className="text-[10px] text-muted-foreground">
                        {t('auth.avatar.hint')}
                      </p>
                    </div>
                  </div>
                  <FieldError className="mt-0 text-[10px] leading-[1.2]">
                    {errors.avatar?.message?.toString()}
                  </FieldError>
                </FieldContent>
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              className="w-full py-6 text-lg"
              disabled={!isValid || isPending}
            >
              {isPending ? t('common.loading') : t('signUp')}
            </Button>
          </form>

          {/* link btn mobile */}
          <div className="mt-8 flex md:hidden flex-col items-start justify-center gap-3">
            <p className="text-[16px] leading-[1.167] text-foreground">
              {t('auth.haveAccount')}
            </p>

            <div
              className={cn(
                'flex flex-col items-start justify-center rounded-[10px] px-3 py-2 backdrop-blur-lg',
                'border border-white/[0.14]',
                'bg-linear-to-b from-[rgba(11,21,20,0.03)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)]',
                'shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)]',
                '[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_24px_64px_0px_0_rgba(0,0,0,0.2)]',
              )}
            >
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-[18px] md:text-[24px] leading-[1.167] tracking-[-1.5px] tracking-wide"
              >
                {t('auth.logInLink')}
                <ArrowRight className="size-5 self-center text-[#90D0B6]" />
              </Link>
            </div>
          </div>
        </div>

        <div
          className={cn(
            'hidden md:flex absolute bottom-10 right-10 z-10 flex-col items-start justify-center rounded-[10px] px-5 py-4 backdrop-blur-lg',
            'border border-white/[0.14]',
            'bg-linear-to-b from-[rgba(11,21,20,0.03)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)]',
            'shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)]',
            '[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_24px_64px_0px_0_rgba(0,0,0,0.2)] z-[100]',
          )}
        >
          <p className="text-[16px] leading-[1.167] text-foreground">
            {t('auth.haveAccount')}
          </p>
          <Link
            to="/login"
            className="flex items-center gap-1.5 text-[24px] font-semibold leading-[1.167] tracking-[-1.5px] text-(--accent-interactive) transition-colors hover:text-primary"
          >
            {t('auth.logInLink')}
            <ArrowRight className="size-5 self-center text-[#90D0B6]" />
          </Link>
        </div>

        {isModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="flex w-full max-w-md flex-col gap-6 rounded-xl border border-border p-8 shadow-lg bg-card text-card-foreground">
              <h2 className="text-2xl font-bold">{t('auth.verify.title')}</h2>
              <p className="text-muted-foreground">
                {t('auth.verify.message')}.
              </p>
              <Button className="w-full" onClick={() => navigate('/login')}>
                {t('auth.verify.button')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignUp;
