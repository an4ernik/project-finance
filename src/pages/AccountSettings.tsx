import {Camera, Mail, PenLine, User} from 'lucide-react';
import {useTranslation} from 'react-i18next';
import defaultAvatar from '@/assets/default-photo.png';
import {
  Field,
  FieldContent,
  FieldDescription,
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

function AccountSettings() {
  const {t} = useTranslation();

  return (
    <section className="h-full rounded-[10px] border border-border bg-card px-6 py-4 text-foreground overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-[28px] font-semibold tracking-[-0.5px]">
          {t('settings.account.title')}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('settings.account.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-2">
        <form className="max-w-[760px]">
          <FieldGroup className="gap-4">
            <Field className="gap-2">
              <FieldContent>
                <div className="flex items-center gap-4">
                  <img
                    src={defaultAvatar}
                    alt="avatar"
                    className="h-20 w-20 rounded-2xl object-cover"
                  />
                  <div>
                    <Button
                      type="button"
                      className="h-10 w-auto px-4 text-base tracking-normal"
                      icon={<Camera className="size-5" />}
                    >
                      {t('settings.account.changePhoto')}
                    </Button>
                    <FieldDescription className="mt-2 text-sm">
                      {t('settings.account.photoHint')}
                    </FieldDescription>
                  </div>
                </div>
              </FieldContent>
            </Field>

            <Field className="gap-1.5">
              <FieldLabel>{t('settings.account.fullName')}</FieldLabel>
              <FieldContent className="relative">
                <Input
                  icon={<User className="size-4" />}
                  placeholder={t('settings.account.fullNamePlaceholder')}
                  className="pr-10"
                />
                <PenLine className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              </FieldContent>
            </Field>

            <Field className="gap-1.5">
              <FieldLabel>{t('settings.account.email')}</FieldLabel>
              <FieldContent className="relative">
                <Input
                  icon={<Mail className="size-4" />}
                  placeholder={t('settings.account.emailPlaceholder')}
                  className="pr-10"
                />
                <PenLine className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              </FieldContent>
              <FieldDescription className="text-sm">
                {t('settings.account.emailHint')}
              </FieldDescription>
            </Field>

            <Field className="gap-1.5">
              <FieldLabel>{t('settings.account.currency')}</FieldLabel>
              <FieldContent>
                <Select defaultValue="UAH">
                  <SelectTrigger className="h-10 w-full rounded-[10px] border-border bg-background/40 text-base">
                    <SelectValue
                      placeholder={t('settings.account.currencyPlaceholder')}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UAH">{t('auth.uah')} (₴)</SelectItem>
                    <SelectItem value="USD">{t('auth.usd')} ($)</SelectItem>
                    <SelectItem value="EUR">{t('auth.eur')} (€)</SelectItem>
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>

            <Field className="gap-1">
              <FieldLabel>{t('settings.account.dateRegistered')}</FieldLabel>
              <FieldDescription className="text-[18px] leading-none text-muted-foreground">
                {t('settings.account.datePlaceholder')}
              </FieldDescription>
            </Field>

            <Button
              type="submit"
              className="mt-1 h-12 text-base tracking-normal"
            >
              {t('settings.account.save')}
            </Button>
          </FieldGroup>
        </form>
        <div />
      </div>
    </section>
  );
}

export default AccountSettings;
