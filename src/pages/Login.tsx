import {useState, useMemo, useEffect, useRef} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {Link, useNavigate} from 'react-router-dom';
import {toast} from 'sonner';
import {useTranslation} from 'react-i18next';
import {Mail, Lock, ChevronRight} from 'lucide-react';
import {cn} from '@/lib/utils';

import moneyBg from '@/assets/money-bg.png';
import moneyBgLight from '@/assets/money-bg-light.png';
import {useLogin} from '@/shared/api/generated/authentication/authentication';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {useTheme} from '@/shared/providers/ThemeProvider';
import {useAuthStore} from '@/shared/store/useAuthStore';
import {type JwtResponseDTO} from '@/shared/api/models';

type LoginFormData = {
  email: string;
  password: string;
};

function Login() {
  const {setAuth} = useAuthStore();
  const {theme} = useTheme();
  const {t, i18n} = useTranslation();
  const navigate = useNavigate();
  const {mutate: loginMutate, isPending} = useLogin();
  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem('rememberMe') === 'true',
  );

  const loginSchema = useMemo(
    () =>
      z.object({
        email: z.string().email({message: t('login.errors.invalidEmail')}),
        password: z.string().min(1, t('login.errors.requiredPassword')),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    trigger,
    formState: {errors, isValid},
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const previousLanguage = useRef(i18n.language);

  useEffect(() => {
    if (previousLanguage.current === i18n.language) return;
    previousLanguage.current = i18n.language;
    const fieldsWithErrors = Object.keys(errors) as Array<keyof LoginFormData>;
    if (fieldsWithErrors.length > 0) {
      void trigger(fieldsWithErrors);
    }
  }, [i18n.language, errors, trigger]);

  const onSubmit = (data: LoginFormData) => {
    loginMutate(
      {data: {email: data.email, password: data.password}},
      {
        onSuccess: response => {
          const data = response as JwtResponseDTO;
          if (data && 'accessToken' in data && data.accessToken) {
            setAuth(
              data.accessToken,
              rememberMe ? data.refreshToken : undefined,
            ); 
          }

          if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
          } else {
            localStorage.removeItem('rememberMe');
          }

          toast.success(t('login.success'));

          setTimeout(() => navigate('/dashboard'), 500);
        },
        onError: error => {
          if (error.status === 401) {
            setError('email', {message: t('login.errors.wrongCredentials')});
            setError('password', {message: t('login.errors.wrongCredentials')});
            toast.error(t('login.errors.wrongCredentials'));
          } else if (error.status === 403) {
            toast.error(t('login.errors.emailNotVerified'));
          } else {
            toast.error(error.detail || t('login.errors.loginError'), {id: 'login-error'});
          }
        },
      },
    );
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden">
      {theme === 'dark' && (
        <div className="absolute -left-20.25 -top-98.75 flex h-371.75 w-341.25 items-center justify-center">
          <img
            src={moneyBg}
            alt=""
            className="h-309.25 w-250 rotate-33 object-cover opacity-30"
          />
        </div>
      )}

      {theme === 'light' && (
        <>
          <div className="absolute left-0 top-0 h-screen w-full pointer-events-none overflow-hidden">
            <img
              src={moneyBgLight}
              alt=""
              className="w-290 object-cover object-center opacity-70"
            />
          </div>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(37deg, rgba(255,255,255,0.8) 0.6%, rgba(255,255,255,0.16) 20%), linear-gradient(122deg, rgba(255,255,255,0.1) 20%, rgb(255,255,255) 70%)',
            }}
          />
        </>
      )}

      <div className="hidden lg:absolute lg:bottom-10 lg:left-10 z-10 lg:flex flex-col items-start justify-center rounded-[10px] px-5 py-4 backdrop-blur-lg shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_24px_64px_0px_rgba(0,0,0,0.2)]">
        <p className="text-[16px] leading-[1.167] text-foreground">
          {t('login.noAccount')}
        </p>
        <Link
          to="/signup"
          className="flex items-center gap-1.5 text-[24px] font-semibold leading-[1.167] tracking-[-1.5px] text-(--accent-interactive) transition-colors hover:text-primary"
        >
          {t('login.signUpLink')}
          <ChevronRight className="size-4" />
        </Link>
      </div>

      <div
        className={cn(
          'relative z-10 flex w-full max-w-[540px] h-full flex-col items-start justify-start gap-7 rounded-[10px] px-6 py-10 overflow-y-auto sm:overflow-visible sm:justify-center sm:absolute sm:right-67 sm:top-0 sm:w-133.5 sm:px-12.5 sm:py-8',
          'border border-white/[0.14] backdrop-blur-lg',
          'bg-linear-to-b from-[rgba(11,21,20,0.03)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)]',
          'shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)]',
          '[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_24px_64px_0px_rgba(0,0,0,0.2)]',
        )}
      >
        <div className="flex flex-col gap-3.5">
          <h1 className="text-[34px] font-bold leading-[1.167] tracking-[-1.5px] text-foreground">
            {t('login.title')}
          </h1>
          <p className="text-[20px] font-medium leading-[1.167] text-muted-foreground">
            {t('login.subtitle')}
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-9"
          autoComplete="off"
        >
          <div className="flex flex-col">
            <div className="flex flex-col gap-1.5 mb-2">
              <Input
                type="email"
                label={t('login.email')}
                icon={<Mail className="size-4" />}
                placeholder={t('login.emailPlaceholder')}
                error={!!errors.email}
                errorMessage={errors.email?.message}
                autoComplete="off"
                {...register('email')}
              />

              <Input
                variant="password"
                label={t('login.password')}
                icon={<Lock className="size-4" />}
                placeholder={t('login.passwordPlaceholder')}
                error={!!errors.password}
                errorMessage={errors.password?.message}
                autoComplete="new-password"
                {...register('password')}
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className="flex items-center gap-2.5"
              >
                <span
                  className={cn(
                    'flex size-4.25 items-center justify-center rounded-full border border-muted-foreground transition-colors',
                    rememberMe &&
                      'border-(--accent-interactive) bg-(--accent-interactive)',
                  )}
                >
                  {rememberMe && (
                    <span className="size-1.75 rounded-full bg-foreground" />
                  )}
                </span>
                <span className="text-[16px] leading-[1.167] text-foreground">
                  {t('login.rememberMe')}
                </span>
              </button>
              <Link
                to="/forgot-password"
                className="text-[16px] leading-[1.167] text-(--light-accent) transition-colors"
              >
                {t('login.forgotPassword')}
              </Link>
            </div>
          </div>

          <Button type="submit" disabled={isPending || !isValid}>
            {isPending ? t('login.loading') : t('login.loginButton')}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
