import {useGetUserProfile} from '../generated/user-management/user-management';
import {useAuthStore} from '@/shared/store/useAuthStore';

export const useMe = () => {
  const isAuth = useAuthStore(state => state.isAuth);
  const query = useGetUserProfile({
    query: {
      enabled: isAuth,
      staleTime: 1000 * 5 * 60,
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  });

  const userData =
    query.data && !('detail' in query.data) ? query.data : undefined;

  return {
    user: userData,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};
