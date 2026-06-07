import {useEffect, useMemo, useState} from 'react';
import {Controller, useForm, useWatch} from 'react-hook-form';
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
  useDeleteUser,
  useUpdateMe,
} from '@/shared/api/generated/user-management/user-management';
import {useUpdateEmail} from '@/shared/api/generated/user-identity/user-identity';
import {useQueryClient} from '@tanstack/react-query';
import {UpdateUserProfileDTOCurrencyCode} from '@/shared/api/models/updateUserProfileDTOCurrencyCode';
import type {ResponseUserDTO} from '@/shared/api/models';
import {parseISO, format} from 'date-fns';
import ConfirmDeleteAccountModal from '@/components/ConfirmDeleteAccountModal';
import axios from 'axios';
import {useSetCurrencySign} from '@/shared/store/useCurrencySign';
import {useGetTransactions} from '@/shared/api/generated/transaction-management/transaction-management';
import {useNavigate} from 'react-router-dom';

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
  const navigate = useNavigate();

  const {mutateAsync: deleteUser} = useDeleteUser();
  const {data} = useGetTransactions({request: {accountId: user?.id}});
  const transactions = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (data && 'data' in data && Array.isArray(data.data)) return data.data;
    return [];
  }, [data]);
  const disabled = transactions.length > 0;
  const setCurrencySign = useSetCurrencySign();
  const userData = user as ResponseUserDTO | undefined;
  const queryClient = useQueryClient();
  const {mutate: updateMe, isPending: isUpdatingProfile} = useUpdateMe();
  const {mutate: updateEmail, isPending: isUpdatingEmail} = useUpdateEmail();
  const [fullNameInput, setFullNameInput] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<boolean>(false);
  const regDate = userData?.createdAt ? parseISO(userData.createdAt) : null;
  const isPending = isUpdatingProfile || isUpdatingEmail;
  const [isOpenDeleteAccountModal, setIsOpenDeleteAccountModal] =
    useState<boolean>(false);

  useEffect(() => {
    if (userData) {
      setCurrencySign(
        userData.currencyCode as UpdateUserProfileDTOCurrencyCode,
      );
    }
  }, [userData, setCurrencySign]);

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
          .instanceof(FileList)
          .optional()
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
    formState: {errors, isValid, isDirty},
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    values: {
      fullName: userData?.fullName ?? '',
      email: userData?.email ?? '',
      currencyCode: userData?.currencyCode ?? '',
    },
  });

  useEffect(() => {
    if (!userData && !isLoading) {
      void refetch();
    }
  }, [userData, isLoading, refetch]);

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

  const onSubmit = (values: FormFields) => {
    if (!userData) return;

    const nextFullName = values.fullName?.trim() || '';
    const nextEmail = values.email?.trim() || '';
    const nextCurrency = values.currencyCode || '';
    const nextAvatar = values.avatar?.[0];

    const fullNameChanged = nextFullName !== (userData.fullName ?? '');
    const emailChanged = nextEmail !== (userData.email ?? '');
    const currencyChanged = nextCurrency !== (userData.currencyCode ?? 'UAH');
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

    const handleError = (error: unknown) => {
      if (
        axios.isAxiosError(error) &&
        error?.response?.status === 409 &&
        emailChanged
      ) {
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
      setCurrencySign(dto.currencyCode);
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

  const handleDeleteAccount = () => {
    deleteUser();
    setIsOpenDeleteAccountModal(false);
    navigate('/login');
  };

  return (
    <section className="h-full min-h-0 px-6 py-6 text-foreground scrollbar-hide">
      <ConfirmDeleteAccountModal
        isOpen={isOpenDeleteAccountModal}
        onClose={() => setIsOpenDeleteAccountModal(false)}
        onConfirmDelete={handleDeleteAccount}
        userEmail={userData?.email ?? ''}
      />
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
                      setFullNameInput(prev => !prev);
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
                      setEmailInput(prev => !prev);
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
                  disabled={disabled}
                  name="currencyCode"
                  control={control}
                  render={({field}) => (
                    <Select
                      disabled={disabled}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger
                        className="w-full  data-disabled:cursor-default"
                        disabled={disabled}
                      >
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
              disabled={!isValid || !isDirty}
            >
              {isPending ? t('common.loading') : t('settings.account.save')}
            </Button>
          </FieldGroup>
        </form>
      </div>
      <div className="w-full lg:max-w-[80%] xl:max-w-[60%] border-t p-2 sm:p-4 mt-6 flex gap-6 flex-col sm:flex-row items-center justify-between">
        <div className="flex flex-col sm:gap-3">
          <span className="text-base text-[#0B1514] dark:text-[#EAF6F3]">
            {t('settings.account.unsafeChanges.unsafeTitle')}
          </span>
          <span className="text-[#6F7E7C] dark:text-[#7F9E97] text-[14px]">
            {t('settings.account.unsafeChanges.unsafeSubTitle')}
          </span>
        </div>
        <Button
          variant="destructive"
          className="w-full sm:max-w-[300px] h-fit py-2 px-5 text-lg"
          onClick={() => setIsOpenDeleteAccountModal(true)}
        >
          {t('settings.account.unsafeChanges.deleteProfileBtn')}
        </Button>
      </div>
    </section>
  );
}

export default AccountSettings;
