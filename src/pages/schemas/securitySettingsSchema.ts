import {z} from 'zod';
import type {TFunction} from 'i18next';

export function createSecuritySchema(t: TFunction) {
  return z
    .object({
      currentPassword: z
        .string()
        .min(1, t('settings.security.errors.currentPasswordRequired')),
      newPassword: z
        .string()
        .min(8, t('settings.security.errors.passwordRequirements'))
        .max(72, t('settings.security.errors.passwordRequirements'))
        .regex(
          /^[a-zA-Z0-9!@#$%^&*]*$/,
          t('settings.security.errors.passwordRequirements'),
        )
        .regex(/[!@#$%^&*]/, t('settings.security.errors.passwordRequirements'))
        .regex(/^\S*$/, t('settings.security.errors.passwordRequirements'))
        .regex(/[A-Z]/, t('settings.security.errors.passwordRequirements'))
        .regex(/[a-z]/, t('settings.security.errors.passwordRequirements'))
        .regex(/[0-9]/, t('settings.security.errors.passwordRequirements')),
      confirmPassword: z
        .string()
        .min(1, t('settings.security.errors.confirmRequired')),
    })
    .refine(data => data.newPassword === data.confirmPassword, {
      message: t('settings.security.errors.mismatch'),
      path: ['confirmPassword'],
    });
}

export type SecurityFormData = z.infer<ReturnType<typeof createSecuritySchema>>;
