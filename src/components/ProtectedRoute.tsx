import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {useAuthStore} from '@/shared/store/useAuthStore';
import {useMe} from '@/shared/api/users/useMe';
import {
  useSetCurrencySign,
  type CurrencyCode,
} from '@/shared/store/useCurrencySign';
import {useEffect} from 'react';

const ProtectedRoute = () => {
  const setCurrency = useSetCurrencySign();
  const isAuth = useAuthStore(state => state.isAuth);
  const {isLoading, user} = useMe();

  const location = useLocation();

  useEffect(() => {
    if (user?.currencyCode) {
      setCurrency(user.currencyCode as CurrencyCode);
    }
  }, [user, setCurrency]);

  if (!isAuth) {
    return <Navigate to="/login" state={{from: location}} replace />;
  }

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
