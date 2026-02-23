import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuth: boolean;
  setAuth: (accessToken: string, refreshToken?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      accessToken: null,
      refreshToken: null,
      isAuth: false,

      setAuth: (accessToken, refreshToken) =>
        set({
          accessToken,
          refreshToken: refreshToken || null,
          isAuth: true,
        }),

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          isAuth: false,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),

      partialize: state => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuth: state.isAuth,
      }),
    },
  ),
);
