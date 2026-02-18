import {useState, useMemo} from 'react';
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

type LoginFormData = {
  email: string;
  password: string;
};

function Login() {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {mutate: loginMutate, isPending} = useLogin();
  const [rememberMe, setRememberMe] = useState(false);

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
    formState: {errors, isValid},
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutate(
      {data: {email: data.email, password: data.password}},
      {
        onSuccess: response => {
          if (
            response?.data &&
            'accessToken' in response.data &&
            response.data.accessToken
          ) {
            localStorage.setItem('accessToken', response.data.accessToken);
          }

          if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
          }

          toast.success(t('login.success'));

          setTimeout(() => navigate('/'), 500);
        },
        onError: error => {
          if (error.status === 401) {
            setError('email', {message: t('login.errors.wrongCredentials')});
            setError('password', {message: t('login.errors.wrongCredentials')});
            toast.error(t('login.errors.wrongCredentials'));
          } else if (error.status === 403) {
            toast.error(t('login.errors.emailNotVerified'));
          } else {
            toast.error(error.detail || t('login.errors.loginError'));
          }
        },
      },
    );
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden dark:bg-[#0b1514]">
      <div className="absolute -left-57.25 -top-98.75 flex h-371.75 w-341.25 items-center justify-center">
        <img
          src={theme === 'dark' ? moneyBg : moneyBgLight}
          alt=""
          className="h-309.25 w-206.25 rotate-33 object-cover opacity-20"
        />
      </div>

      <div className="absolute bottom-10 left-10 z-10 flex flex-col items-start justify-center rounded-[10px] px-5 py-4 backdrop-blur-lg shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_24px_64px_0px_rgba(0,0,0,0.2)]">
        <p className="text-[16px] leading-[1.167] dark:text-[#eaf6f3]">
          {t('login.noAccount')}
        </p>
        <Link
          to="/signup"
          className="flex items-center gap-1.5 text-[24px] font-semibold leading-[1.167] tracking-[-1.5px] text-[#315e55] transition-colors hover:text-[#3d7568]"
        >
          {t('login.signUpLink')}
          <ChevronRight className="size-4" />
        </Link>
      </div>

      <div
        className={cn(
          'absolute right-40 top-0 flex h-full w-133.5 flex-col items-start justify-center gap-7 rounded-[10px] px-12.5',
          'border border-white/[0.14] backdrop-blur-lg',
          'bg-linear-to-b from-[rgba(11,21,20,0.03)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)]',
          'shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)]',
          '[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_24px_64px_0px_rgba(0,0,0,0.2)]',
        )}
      >
        <div className="flex flex-col gap-3.5">
          <h1 className="text-[34px] font-bold leading-[1.167] tracking-[-1.5px] dark:text-[#eaf6f3]">
            {t('login.title')}
          </h1>
          <p className="text-[20px] font-medium leading-[1.167] dark:text-[#bfd9d2]">
            {t('login.subtitle')}
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-9"
        >
          <div className="flex flex-col">
            <div className="flex flex-col gap-5 mb-6">
              <Input
                label={t('login.email')}
                icon={<Mail className="size-4" />}
                type="email"
                placeholder={t('login.emailPlaceholder')}
                error={!!errors.email}
                errorMessage={errors.email?.message}
                {...register('email')}
              />

              <Input
                variant="password"
                label={t('login.password')}
                icon={<Lock className="size-4" />}
                placeholder={t('login.passwordPlaceholder')}
                error={!!errors.password}
                errorMessage={errors.password?.message}
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
                    'flex size-4.25 items-center justify-center rounded-full border border-[#bfd9d2] transition-colors',
                    rememberMe && 'border-[#315e55] bg-[#315e55]',
                  )}
                >
                  {rememberMe && (
                    <span className="size-1.75 rounded-full dark:bg-[#eaf6f3]" />
                  )}
                </span>
                <span className="text-[16px] leading-[1.167] dark:text-[#eaf6f3]">
                  {t('login.rememberMe')}
                </span>
              </button>
              <Link
                to="/forgot-password"
                className="text-[16px] leading-[1.167] dark:text-[#eaf6f3] transition-colors dark:hover:text-[#bfd9d2]"
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
