import {useGetUserProfile} from '../generated/user-management/user-management';
import {useAuthStore} from '@/shared/store/useAuthStore';
import type {UserResponseDTO} from '@/shared/api/models';

export const useMe = () => {
  const isAuth = useAuthStore(state => state.isAuth);
  const query = useGetUserProfile({
    query: {
      enabled: isAuth,
      staleTime: 1000 * 5 * 60,
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  const rawData = query.data as any;
  const normalizedData: UserResponseDTO | undefined =
    rawData && typeof rawData === 'object' && 'data' in rawData
      ? (rawData.data as UserResponseDTO)
      : (rawData as UserResponseDTO | undefined);

  const userData =
    normalizedData && !('detail' in (normalizedData as any))
      ? normalizedData
      : undefined;

  return {
    user: userData,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};
