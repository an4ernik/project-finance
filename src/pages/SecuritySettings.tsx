import {useMemo, useRef, useEffect} from 'react';
import {useForm, useWatch} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {toast} from 'sonner';
import {useTranslation} from 'react-i18next';
import {Lock} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {createSecuritySchema} from './schemas/securitySettingsSchema.ts';
import {useUpdatePassword} from '@/shared/api/generated/user-identity/user-identity.ts';

type SecurityFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

function SecuritySettings() {
  const {t, i18n} = useTranslation();
  const {mutateAsync: updatePassword} = useUpdatePassword();

  const schema = useMemo(() => createSecuritySchema(t), [t]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    trigger,
    formState: {errors, isSubmitting},
  } = useForm<SecurityFormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const [currentPassword, newPassword, confirmPassword] = useWatch({
    control,
    name: ['currentPassword', 'newPassword', 'confirmPassword'],
  });

  const previousLanguage = useRef(i18n.language);

  useEffect(() => {
    if (previousLanguage.current === i18n.language) return;
    previousLanguage.current = i18n.language;
    const fieldsWithErrors = Object.keys(errors) as Array<
      keyof SecurityFormData
    >;
    if (fieldsWithErrors.length > 0) {
      void trigger(fieldsWithErrors);
    }
  }, [i18n.language, errors, trigger]);

  const hasAllFields = !!currentPassword && !!newPassword && !!confirmPassword;

  const onSubmit = async (data: SecurityFormData) => {
    try {
      await updatePassword({
        data: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmNewPassword: data.confirmPassword,
        },
      });
      toast.success(t('settings.security.saveSuccess'));
      reset();
    } catch (error: unknown) {
      const status =
        error != null &&
        typeof error === 'object' &&
        'response' in error &&
        error.response != null &&
        typeof error.response === 'object' &&
        'status' in error.response
          ? (error.response as {status: number}).status
          : null;

      if (status === 400 || status === 401) {
        setError('currentPassword', {
          message: t('settings.security.errors.currentPasswordWrong'),
        });
      } else {
        toast.error(t('common.error'));
      }
    }
  };

  return (
    <section className="h-full min-h-0 overflow-y-auto px-6 py-6 text-foreground">
      <div className="max-w-[540px]">
        <div className="mb-6">
          <h2 className="text-[20px] font-semibold tracking-[-0.5px]">
            {t('settings.security.title')}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('settings.security.subtitle')}
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Input
              label={t('settings.security.currentPassword')}
              variant="password"
              placeholder={t('settings.security.currentPasswordPlaceholder')}
              icon={<Lock className="size-4" />}
              error={!!errors.currentPassword}
              errorMessage={errors.currentPassword?.message}
              {...register('currentPassword')}
            />
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[16px] leading-[1.167] text-muted-foreground">
                  {t('settings.security.newPassword')}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {t('auth.passwordRules')}
                </span>
              </div>
              <Input
                variant="password"
                placeholder={t('settings.security.newPasswordPlaceholder')}
                icon={<Lock className="size-4" />}
                error={!!errors.newPassword}
                errorMessage={errors.newPassword?.message}
                {...register('newPassword')}
              />
            </div>
            <Input
              label={t('settings.security.confirmPassword')}
              variant="password"
              placeholder={t('settings.security.confirmPasswordPlaceholder')}
              icon={<Lock className="size-4" />}
              error={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </div>
          <Button
            type="submit"
            className="mt-2 h-12 text-base tracking-normal"
            disabled={!hasAllFields || isSubmitting}
          >
            {isSubmitting
              ? t('settings.security.loading')
              : t('settings.security.updateButton')}
          </Button>
        </form>
      </div>
    </section>
  );
}

export default SecuritySettings;
