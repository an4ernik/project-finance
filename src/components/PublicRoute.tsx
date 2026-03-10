import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {useAuthStore} from '@/shared/store/useAuthStore';
import {useMe} from '@/shared/api/users/useMe';

const PublicRoute = () => {
  const isAuth = useAuthStore(state => state.isAuth);
  const {isLoading} = useMe();
  const location = useLocation();

  if (isAuth) {
    return <Navigate to="/dashboard" state={{from: location}} replace />;
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

export default PublicRoute;
