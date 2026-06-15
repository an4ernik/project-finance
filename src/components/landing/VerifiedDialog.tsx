import {useNavigate, useSearchParams} from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {useTranslation} from 'react-i18next';

export function VerifiedDialog() {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isVerified = searchParams.get('email_verified') === 'true';
  const isExpired = searchParams.get('token_expired') === 'true';

  const isOpen = isVerified || isExpired;

  const handleClose = () => {
    navigate('/', {replace: true});
  };

  const handleActionButtonClick = () => {
    if (isExpired) {
      navigate('/signup', {replace: true});
    } else {
      navigate('/login', {replace: true});
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isExpired ? t('auth.expired.title') : t('auth.confirmed.title')}
          </DialogTitle>
          <DialogDescription>
            {isExpired
              ? t('auth.expired.message')
              : t('auth.confirmed.message')}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={handleActionButtonClick}>
            {isExpired ? t('auth.expired.button') : t('auth.confirmed.button')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
