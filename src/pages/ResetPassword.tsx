import {useEffect, useMemo, useRef} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {toast} from 'sonner';
import {useTranslation} from 'react-i18next';
import {Lock} from 'lucide-react';
import {cn} from '@/lib/utils';

import vectors from '@/assets/base-vectors.png';
import {useResetPassword} from '@/shared/api/generated/authentication/authentication';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {useAuthStore} from '@/shared/store/useAuthStore';

type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

function ResetPassword() {
  const {t, i18n} = useTranslation();
  const setAuth = useAuthStore(state => state.setAuth);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {mutate: resetPassword, isPending} = useResetPassword();

  const token = searchParams.get('resetToken');

  useEffect(() => {
    if (!token) {
      toast.error(t('resetPassword.errors.tokenInvalid'));
      navigate('/login');
    }
  }, [token, navigate, t]);

  const resetPasswordSchema = useMemo(
    () =>
      z
        .object({
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
          confirmPassword: z
            .string()
            .min(1, {message: t('auth.errors.confirmRequired')}),
        })
        .refine(data => data.password === data.confirmPassword, {
          message: t('resetPassword.errors.mismatch'),
          path: ['confirmPassword'],
        }),
    [t],
  );

  const {
    register,
    handleSubmit,
    trigger,
    formState: {errors, isValid},
    setError,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
  });

  const previousLanguage = useRef(i18n.language);

  useEffect(() => {
    if (previousLanguage.current === i18n.language) return;
    previousLanguage.current = i18n.language;
    const fieldsWithErrors = Object.keys(errors) as Array<
      keyof ResetPasswordFormData
    >;
    if (fieldsWithErrors.length > 0) {
      void trigger(fieldsWithErrors as any);
    }
  }, [i18n.language, errors, trigger]);

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error(t('resetPassword.errors.tokenInvalid'));
      return;
    }

    resetPassword(
      {
        data: {
          password: data.password,
          confirmPassword: data.confirmPassword,
        },
        params: {token},
      },
      {
        onSuccess: response => {
          if (
            response?.data &&
            'accessToken' in response.data &&
            response.data.accessToken
          ) {
            setAuth(response.data.accessToken);
          }

          toast.success(t('resetPassword.success'));
          setTimeout(() => navigate('/'), 1500);
        },
        onError: error => {
          const status = 'status' in error ? error.status : null;
          const detail = 'detail' in error ? error.detail : null;

          if (status === 401 || status === 400) {
            toast.error(t('resetPassword.errors.tokenInvalid'));
            setTimeout(() => navigate('/login'), 2000);
          } else if (status === 409) {
            setError('password', {
              message: t('resetPassword.errors.invalidPassword'),
            });
            toast.error(t('resetPassword.errors.invalidPassword'));
          } else {
            toast.error(
              typeof detail === 'string'
                ? detail
                : t('resetPassword.errors.resetError'),
            );
          }
        },
      },
    );
  };

  return (
    <div className="relative flex h-screen w-full overflow-y-auto bg-background">
      <div className="absolute top-0 left-0 flex w-full h-dvh items-center justify-center">
        <div>
          <img src={vectors} alt="" className="w-full h-dvh object-cover" />
        </div>
      </div>

      <div
        className={cn(
          'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
          'flex w-171.75 flex-col items-start justify-center gap-9 rounded-[10px] px-12.5 py-30',
          'border border-white/[0.14] backdrop-blur-lg',
          'bg-linear-to-b from-[rgba(11,21,20,0.03)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)]',
          'shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)]',
          '[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_24px_64px_0px_rgba(0,0,0,0.2)]',
        )}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-10.75"
        >
          <div className="flex flex-col gap-9.5">
            <p className="text-[34px] font-bold leading-[1.167] tracking-[-1.5px] text-foreground">
              {t('resetPassword.title')}
            </p>
            <p className="text-[20px] font-medium leading-[1.167] text-muted-foreground whitespace-pre-wrap">
              {t('resetPassword.subtitle')}
            </p>
          </div>

          <div className="flex w-full flex-col gap-1">
            <div className="flex flex-col gap-1.75">
              <div className="flex items-center justify-between w-full">
                <label className="text-[16px] leading-[1.167] text-muted-foreground">
                  {t('resetPassword.newPassword')}
                </label>
                <p className="text-[10px] leading-[1.167] text-(--text-tertiary)/80">
                  {t('resetPassword.passwordRules')}
                </p>
              </div>
              <Input
                variant="password"
                icon={<Lock className="size-4" />}
                placeholder={t('resetPassword.newPasswordPlaceholder')}
                error={!!errors.password}
                errorMessage={errors.password?.message}
                {...register('password')}
              />
            </div>

            <Input
              variant="password"
              label={t('resetPassword.confirmPassword')}
              icon={<Lock className="size-4" />}
              placeholder={t('resetPassword.confirmPasswordPlaceholder')}
              error={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </div>

          <Button type="submit" disabled={isPending || !isValid}>
            {isPending
              ? t('resetPassword.loading')
              : t('resetPassword.updateButton')}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
