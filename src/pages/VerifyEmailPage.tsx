import {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {toast} from 'sonner';
import axios from 'axios';
import {useTranslation} from 'react-i18next';
import {useAuthStore} from '@/shared/store/useAuthStore';
import {verifyToken} from '@/shared/api/generated/authentication/authentication';
import {verifyEmail} from '@/shared/api/generated/user-identity/user-identity';
import {type JwtResponseDTO, type ProblemDetail} from '@/shared/api/models';

const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

type VerificationFlow = 'registration' | 'email_change' | 'unknown';

function VerifyEmailPage() {
  const {t} = useTranslation();
  const setAuth = useAuthStore(state => state.setAuth);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      toast.error(t('auth.verify.tokenDoesntExist'));
      navigate('/login', {replace: true});
      return;
    }

    const runVerification = async () => {
      const decoded = parseJwt(token);
      const purpose = decoded?.purpose;

      const flow: VerificationFlow =
        purpose === 'email_verification'
          ? 'registration'
          : purpose === 'email_update_verification' ||
              purpose === 'email_change'
            ? 'email_change'
            : 'unknown';

      try {
        if (flow === 'email_change') {
          await verifyEmail({token});
          toast.success(t('auth.verify.activationSuccess'));
          navigate('/settings', {replace: true});
          return;
        }

        // Try registration verification flow (default/registration/unknown)
        const authResponse = (await verifyToken({
          token,
        })) as unknown as JwtResponseDTO;
        const accessToken = authResponse?.accessToken;

        if (accessToken) {
          setAuth(accessToken);
        }

        toast.success(t('auth.verify.activationSuccess'));
        navigate('/?email_verified=true', {replace: true});
        return;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          const detail = (error.response?.data as ProblemDetail)?.detail;

          if (status === 409) {
            if (flow === 'email_change') {
              toast.info(t('auth.verify.accountAlreadyActivated'));
              navigate('/settings', {replace: true});
            } else {
              toast.info(t('auth.verify.accountAlreadyActivated'));
              navigate('/login', {replace: true});
            }
            return;
          }

          const isWrongTokenType =
            status === 401 &&
            typeof detail === 'string' &&
            detail.includes('Invalid token type');

          if (flow === 'unknown' && (isWrongTokenType || status === 400)) {
            try {
              await verifyEmail({token});
              toast.success(t('auth.verify.activationSuccess'));
              navigate('/settings', {replace: true});
              return;
            } catch {
              toast.error(t('auth.verify.activationError'));
              navigate('/signup', {replace: true});
              return;
            }
          }
          if (status === 404) {
            toast.info(t('auth.verify.tokenHasExpired'));
            navigate(
              flow === 'email_change' ? '/settings' : '/?token_expired=true',
              {replace: true},
            );
            return;
          }
        }

        toast.error(t('auth.verify.activationError'));
        navigate(flow === 'email_change' ? '/settings' : '/signup', {
          replace: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    void runVerification();
  }, [token, navigate, setAuth, t]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
      <div className="flex flex-col items-center gap-4">
        <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-lg font-medium animate-pulse">
          {isLoading ? t('common.loading') : t('auth.verify.loading')}
        </p>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
