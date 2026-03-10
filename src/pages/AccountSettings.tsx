import {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {Camera, Mail, PenLine, User} from 'lucide-react';
import {toast} from 'sonner';
import {useTranslation} from 'react-i18next';
import defaultAvatar from '@/assets/default-photo.png';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
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
import {useMe} from '@/shared/api/users/useMe';
import {
  getGetUserProfileQueryKey,
  useUpdateEmail,
  useUpdateMe,
} from '@/shared/api/generated/user-management/user-management';
import {useQueryClient} from '@tanstack/react-query';
import {UpdateUserProfileDTOCurrencyCode} from '@/shared/api/models/updateUserProfileDTOCurrencyCode';
import type {ResponseUserDTO} from '@/shared/api/models';
import {parseISO, format} from 'date-fns';

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
];

function AccountSettings() {
  const {t} = useTranslation();
  const {user, isLoading, refetch} = useMe();
  const userData = user as ResponseUserDTO | undefined;
  const queryClient = useQueryClient();
  const {mutate: updateMe, isPending: isUpdatingProfile} = useUpdateMe();
  const {mutate: updateEmail, isPending: isUpdatingEmail} = useUpdateEmail();
  const [fullNameInput, setFullNameInput] = useState<Boolean>(false);
  const [emailInput, setEmailInput] = useState<Boolean>(false);
  const regDate = userData?.createdAt ? parseISO(userData.createdAt) : null;
  const isPending = isUpdatingProfile || isUpdatingEmail;

  const date = regDate && format(regDate, 'dd.MM.yyyy');

  const schema = useMemo(
    () =>
      z.object({
        fullName: z
          .union([
            z
              .string()
              .trim()
              .min(3, t('auth.errors.fullNameLength'))
              .max(35, t('auth.errors.fullNameLength'))
              .regex(/^[A-Za-zА-Яа-яЁёІіЇїЄє\s'’ʼ]+$/, {
                message: t('auth.errors.fullNameLength'),
              }),
            z.literal(''),
          ])
          .optional(),
        email: z
          .union([
            z.string().email(t('settings.account.errors.invalidEmail')),
            z.literal(''),
          ])
          .optional(),
        currencyCode: z.string().optional(),
        avatar: z
          .any()
          .refine(
            files =>
              !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE,
            t('settings.account.errors.fileSize'),
          )
          .refine(
            files =>
              !files ||
              files.length === 0 ||
              ACCEPTED_IMAGE_TYPES.includes(files[0].type),
            t('settings.account.errors.fileType'),
          )
          .optional(),
      }),
    [t],
  );

  type FormFields = z.infer<typeof schema>;

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: {errors, isValid},
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      fullName: '',
      email: '',
      currencyCode: '',
    },
  });

  useEffect(() => {
    reset({
      fullName: '',
      email: '',
      currencyCode: '',
      avatar: undefined,
    });
  }, [userData, reset]);

  useEffect(() => {
    if (!userData && !isLoading) {
      void refetch();
    }
  }, [userData, isLoading, refetch]);

  const avatarFile = watch('avatar');
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

  const onSubmit = (values: FormFields) => {
    if (!userData) return;

    const nextFullName = values.fullName?.trim() || '';
    const nextEmail = values.email?.trim() || '';
    const nextCurrency = values.currencyCode || '';
    const nextAvatar = values.avatar?.[0];

    const fullNameChanged =
      nextFullName.length > 0 && nextFullName !== (userData.fullName ?? '');
    const emailChanged =
      nextEmail.length > 0 && nextEmail !== (userData.email ?? '');
    const currencyChanged =
      nextCurrency.length > 0 &&
      nextCurrency !== (userData.currencyCode ?? 'UAH');
    const avatarChanged = !!nextAvatar;

    if (
      !fullNameChanged &&
      !emailChanged &&
      !currencyChanged &&
      !avatarChanged
    ) {
      toast.info(t('settings.account.nothingToUpdate'));
      return;
    }

    const needsProfileUpdate =
      fullNameChanged || currencyChanged || avatarChanged;
    const needsEmailUpdate = emailChanged;

    const dto = {
      fullName: fullNameChanged ? nextFullName : (userData.fullName ?? ''),
      currencyCode: (currencyChanged
        ? nextCurrency
        : (userData.currencyCode ?? 'UAH')) as UpdateUserProfileDTOCurrencyCode,
    };

    const handleError = (error: any) => {
      if (error?.response?.status === 409 && emailChanged) {
        toast.error(t('auth.emailExists'));
        return;
      }
      toast.error(t('common.error'));
    };

    const handleSuccess = () => {
      void queryClient.invalidateQueries({
        queryKey: getGetUserProfileQueryKey(),
      });
      void refetch();
      toast.success(t('settings.account.saveSuccess'));
      reset({
        fullName: '',
        email: '',
        currencyCode: '',
        avatar: undefined,
      });
    };

    if (needsProfileUpdate && needsEmailUpdate) {
      updateMe(
        {
          data: {
            dto,
            avatar: nextAvatar,
          },
        },
        {
          onSuccess: () => {
            updateEmail(
              {data: {email: nextEmail}},
              {
                onSuccess: handleSuccess,
                onError: handleError,
              },
            );
          },
          onError: handleError,
        },
      );
      return;
    }

    if (needsProfileUpdate) {
      updateMe(
        {
          data: {
            dto,
            avatar: nextAvatar,
          },
        },
        {
          onSuccess: handleSuccess,
          onError: handleError,
        },
      );
      return;
    }

    updateEmail(
      {data: {email: nextEmail}},
      {
        onSuccess: handleSuccess,
        onError: handleError,
      },
    );
  };

  return (
    <section className="h-full min-h-0 overflow-y-auto px-6 py-6 text-foreground">
      <div className="max-w-[540px]">
        <div className="mb-6">
          <h2 className="text-[20px] font-semibold tracking-[-0.5px]">
            {t('settings.account.title')}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('settings.account.subtitle')}
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <Field className="gap-2">
              <FieldContent>
                <div className="flex items-center gap-4">
                  <img
                    src={previewUrl || userData?.avatarUrl || defaultAvatar}
                    alt="avatar"
                    className="h-20 w-20 rounded-2xl object-cover"
                  />
                  <div>
                    <label htmlFor="avatar-upload">
                      <span className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-[10px] border px-4 text-base tracking-normal [background:var(--light-btn-bg-full)] text-[#eaf6f3] backdrop-blur-[5px] dark:[background:linear-gradient(to_bottom,rgba(49,95,85,0.55),rgba(49,95,85,0.18))]">
                        {t('settings.account.changePhoto')}
                        <Camera className="size-5" />
                      </span>
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.gif,image/jpeg,image/png,image/gif"
                      {...register('avatar')}
                    />
                    <FieldDescription className="mt-2 text-sm">
                      {t('settings.account.photoHint')}
                    </FieldDescription>
                    <FieldError className="mt-1 text-[10px]">
                      {errors.avatar?.message?.toString()}
                    </FieldError>
                  </div>
                </div>
              </FieldContent>
            </Field>

            <Field className="gap-1.5" data-invalid={!!errors.fullName}>
              <FieldLabel className="text-foreground">
                {t('settings.account.fullName')}
              </FieldLabel>
              <FieldContent>
                <div className="relative">
                  <Input
                    icon={<User className="size-4" />}
                    placeholder={
                      userData?.fullName ||
                      t('settings.account.fullNamePlaceholder')
                    }
                    className="pr-10"
                    {...register('fullName')}
                    disabled={!fullNameInput}
                    errorMessage={errors.fullName?.message}
                  />
                  <PenLine
                    onClick={() => {
                      fullNameInput
                        ? setFullNameInput(false)
                        : setFullNameInput(true);
                    }}
                    className="absolute right-3 top-3 size-5 cursor-pointer text-muted-foreground"
                  />
                </div>
              </FieldContent>
            </Field>

            <Field className="gap-1.5" data-invalid={!!errors.email}>
              <FieldLabel className="text-foreground">
                {t('settings.account.email')}
              </FieldLabel>
              <FieldContent>
                <div className="relative">
                  <Input
                    icon={<Mail className="size-4" />}
                    placeholder={
                      userData?.email || t('settings.account.emailPlaceholder')
                    }
                    className="pr-10"
                    {...register('email')}
                    disabled={!emailInput}
                    errorMessage={errors.email?.message}
                  />
                  <PenLine
                    onClick={() => {
                      emailInput ? setEmailInput(false) : setEmailInput(true);
                    }}
                    className="absolute right-3 top-3 size-5 cursor-pointer text-muted-foreground"
                  />
                </div>
              </FieldContent>
              <FieldDescription className="text-sm">
                {t('settings.account.emailHint')}
              </FieldDescription>
            </Field>

            <Field className="gap-1.5">
              <FieldLabel className="text-foreground">
                {t('settings.account.currency')}
              </FieldLabel>
              <FieldContent>
                <Controller
                  name="currencyCode"
                  control={control}
                  render={({field}) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-10 w-full rounded-[10px] border border-[rgba(46,45,45,0.14)] px-2.5 text-[16px] leading-[1.167] shadow-none dark:border-white/[0.14] dark:bg-transparent dark:shadow-none bg-linear-to-b from-[rgba(11,21,20,0.03)] from-[1.442%] via-[rgba(49,95,85,0.1)] via-[50.481%] to-[rgba(144,208,182,0.05)] to-[94.712%] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.35),0px_4px_4px_0px_rgba(75,75,75,0.25)]">
                        <SelectValue
                          placeholder={
                            userData?.currencyCode ||
                            t('settings.account.currencyPlaceholder')
                          }
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
              </FieldContent>
            </Field>

            <Field className="gap-1">
              <FieldLabel className="text-foreground">
                {t('settings.account.dateRegistered')}
              </FieldLabel>
              <FieldDescription className="text-[20px] leading-none text-muted-foreground">
                {date}
              </FieldDescription>
            </Field>

            <Button
              type="submit"
              className="w-full py-6 text-lg"
              disabled={!isValid}
            >
              {isPending ? t('common.loading') : t('settings.account.save')}
            </Button>
          </FieldGroup>
        </form>
      </div>
    </section>
  );
}

export default AccountSettings;
