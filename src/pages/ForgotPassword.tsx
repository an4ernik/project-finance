import {useState, useMemo, useEffect, useRef} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {Link} from 'react-router-dom';
import {toast} from 'sonner';
import {useTranslation} from 'react-i18next';
import {Mail} from 'lucide-react';
import {cn} from '@/lib/utils';

import vectors from '@/assets/base-vectors.png';
import arrow from '@/assets/icons/arrow-icon.svg';
import {useSendResetPasswordToken} from '@/shared/api/generated/authentication/authentication';
import {ResetConfirmationModal} from '@/components/ResetConfirmationModal/ResetConfirmationModal';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';

type ForgotPasswordFormData = {
  email: string;
};

function ForgotPassword() {
  const {t, i18n} = useTranslation();

  const {mutate: sendResetToken, isPending} = useSendResetPasswordToken();
  const [emailSent, setEmailSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (!emailSent || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, emailSent]);

  const forgotPasswordSchema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .email({message: t('forgotPassword.errors.invalidEmail')}),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    formState: {errors, isValid},
    getValues,
    setError,
    trigger,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
  });

  const previousLanguage = useRef(i18n.language);

  useEffect(() => {
    if (previousLanguage.current === i18n.language) return;
    previousLanguage.current = i18n.language;
    const fieldsWithErrors = Object.keys(errors) as Array<
      keyof ForgotPasswordFormData
    >;
    if (fieldsWithErrors.length > 0) {
      void trigger(fieldsWithErrors as any);
    }
  }, [i18n.language, errors, trigger]);

  const onSubmit = (data: ForgotPasswordFormData) => {
    sendResetToken(
      {params: {email: data.email}},
      {
        onSuccess: () => {
          setEmailSent(true);
          setTimeLeft(60);
        },
        onError: error => {
          const status = 'status' in error ? error.status : null;
          const detail = 'detail' in error ? error.detail : null;

          if (status === 400) {
            setError('email', {
              message: t('forgotPassword.errors.invalidEmail'),
            });
            toast.error(t('forgotPassword.errors.invalidEmail'));
          } else if (status === 409) {
            setError('email', {
              message: t('forgotPassword.errors.userNotFound'),
            });
            toast.error(t('forgotPassword.errors.userNotFound'));
          } else {
            toast.error(
              typeof detail === 'string'
                ? detail
                : t('forgotPassword.errors.sendError'),
            );
          }
        },
      },
    );
  };

  const handleResend = () => {
    if (timeLeft > 0) return;

    const email = getValues('email');

    sendResetToken(
      {params: {email}},
      {
        onSuccess: () => {
          setTimeLeft(60);
          toast.success(t('forgotPassword.resendSuccess'));
        },
        onError: error => {
          const detail = 'detail' in error ? error.detail : null;
          toast.error(
            typeof detail === 'string'
              ? detail
              : t('forgotPassword.errors.sendError'),
          );
        },
      },
    );
  };
  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background">
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
        {!emailSent ? (
          <>
            <div className="flex w-full flex-col gap-5.5">
              <div className="flex flex-col gap-9.5">
                <div className="flex flex-col gap-2">
                  <p className="text-[34px] font-bold leading-[1.167] tracking-[-1.5px] text-foreground">
                    {t('forgotPassword.title1')}
                  </p>
                  <p className="text-[34px] font-bold leading-[1.167] tracking-[-1.5px] text-foreground">
                    {t('forgotPassword.title2')}
                  </p>
                </div>
                <p className="text-[20px] font-medium leading-[1.167] text-muted-foreground whitespace-pre-wrap">
                  {t('forgotPassword.subtitle')}
                </p>
              </div>

              <div className="flex w-full flex-col items-end gap-5.5">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex w-full flex-col gap-5.5"
                >
                  <Input
                    label={t('forgotPassword.email')}
                    icon={<Mail className="size-4" />}
                    type="email"
                    placeholder={t('forgotPassword.emailPlaceholder')}
                    error={!!errors.email}
                    errorMessage={errors.email?.message}
                    {...register('email')}
                  />

                  <Button type="submit" disabled={isPending || !isValid}>
                    {isPending
                      ? t('forgotPassword.loading')
                      : t('forgotPassword.sendButton')}
                  </Button>
                </form>
              </div>
            </div>

            <div className="flex w-full items-center justify-center gap-7">
              <p className="text-[14px] leading-[1.167] tracking-[-1.5px] text-(--text-tertiary)/80">
                {t('forgotPassword.rememberPassword')}
              </p>
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-[16px] font-semibold leading-[1.167] tracking-[-1.5px] text-primary transition-colors hover:opacity-80"
                style={{
                  backgroundImage:
                    'linear-gradient(0deg, rgba(2, 160, 120, 0.3) 0%, rgba(2, 160, 120, 0.5) 20.192%, rgba(2, 160, 120, 0.8) 66.346%, rgb(2, 160, 120) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {t('forgotPassword.loginLink')}
                <div className="flex items-center justify-center p-1">
                  <img
                    src={arrow}
                    alt="arrow to login"
                    width={28}
                    height={28}
                  />
                </div>
              </Link>
            </div>
          </>
        ) : (
          <ResetConfirmationModal timeLeft={timeLeft} onResend={handleResend} />
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
