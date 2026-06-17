import {useState, useMemo, useEffect, useRef} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {Link, useNavigate} from 'react-router-dom';
import {toast} from 'sonner';
import {useTranslation} from 'react-i18next';
import {Mail, Lock, ArrowRight} from 'lucide-react';
import {cn} from '@/lib/utils';
import backgroundImage from '@/assets/white-background-login.png';
import backgroundImageDark from '@/assets/dark-background-login.png';

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
    clearErrors,
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
            toast.error(error.detail || t('login.errors.loginError'), {
              id: 'login-error',
            });
          }
        },
      },
    );
  };

  const backgroundImageSrc =
    theme === 'dark' ? backgroundImageDark : backgroundImage;

  return (
    <div
      className="relative px-5 flex justify-center bg-cover lg:bg-contain md:justify-end h-screen w-full max-w-[2060px] mx-auto overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImageSrc})`,
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* register button */}
      <div className="hidden md:fixed bottom-7.5 left-7.5 z-[100] md:flex h-fit gap-2 items-start justify-center rounded-[10px] px-5 py-4 backdrop-blur-lg shadow-[0px_24px_64px_0px_rgba(0, 0, 0, 0.458)] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_24px_64px_0px_rgba(0,0,0,0.2)]">
        <div className="flex flex-col gap-1.5">
          <p className="text-[16px] leading-[1.167] text-foreground">
            {t('login.noAccount')}
          </p>
          <Link
            to="/signup"
            className="flex items-center gap-1.5 text-[24px] font-semibold leading-[1.167] tracking-[-1.5px] text-(--accent-interactive) transition-colors hover:text-primary"
          >
            {t('login.signUpLink')}
          </Link>
        </div>
        <ArrowRight className="size-5 self-center text-[#90D0B6]" />
      </div>

      {/* login form */}
      <div
        className={cn(
          'scrollbar-hide z-10 w-full max-w-[540px] h-full static sm:absolute flex flex-col justify-start md:justify-center gap-7 rounded-[10px] px-6 py-10 overflow-y-auto sm:px-12.5 sm:py-8 mr-0 md:mr-[100px] lg:mr-[150px]',
          'border border-white/[0.14] backdrop-blur-md',
          'bg-linear-to-b from-[rgba(11,21,20,0.03)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)]',
          'shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)]',
          '[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_24px_64px_0px_rgba(0,0,0,0.2)]',
        )}
      >
        <div className="flex flex-col landscape:mt-12 gap-3.5">
          <h1 className="text-[34px] font-bold leading-[1.167] tracking-[-1.5px] text-foreground">
            {t('login.title')}
          </h1>
          <p className="text-[24px] font-medium leading-[1.167] text-muted-foreground">
            {t('login.subtitle')}
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-9"
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
                autoComplete="email"
                {...register('email', {
                  onChange: () => {
                    if (
                      errors.email?.message ===
                      t('login.errors.wrongCredentials')
                    ) {
                      clearErrors(['email', 'password']);
                    }
                  },
                })}
              />

              <Input
                variant="password"
                label={t('login.password')}
                icon={<Lock className="size-4" />}
                placeholder={t('login.passwordPlaceholder')}
                error={!!errors.password}
                errorMessage={errors.password?.message}
                autoComplete="current-password"
                {...register('password', {
                  onChange: () => {
                    if (
                      errors.password?.message ===
                      t('login.errors.wrongCredentials')
                    ) {
                      clearErrors(['email', 'password']);
                    }
                  },
                })}
              />
            </div>

            <div className="flex flex-wrap md:flex-row gap-7 md:gap-0 items-start md:items-center justify-between mt-2">
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

          {/* register btn */}
          <div className="flex flex-col md:hidden gap-5 mt-5 p-3 justify-center align-center w-fit">
            <p className="text-[16px] leading-[1.167] text-foreground">
              {t('login.noAccount')}
            </p>
            <div className="flex items-center gap-3 border rounded-md shadow-md shadow-white/5 p-3">
              <Link
                to="/signup"
                className="flex items-center gap-1.5 text-[18px] sm:text-[24px] leading-[1.167] tracking-[0.65px] text-foreground transition-colors hover:text-primary"
              >
                {t('login.signUpLink')}
              </Link>
              <ArrowRight className="size-5 self-center text-[#90D0B6]" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
