import axios, {AxiosError, type InternalAxiosRequestConfig} from 'axios';
import {useAuthStore} from '../store/useAuthStore';

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  'https://recount-confiding-substance.ngrok-free.dev'
).replace(/\/$/, '');

export const api = axios.create({
  baseURL: `${API_BASE_URL}/`,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(config => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes('/auth/login')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({resolve, reject});
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const {setAuth, refreshToken} = useAuthStore.getState();
        const response = await axios.post(
          `${API_BASE_URL}/api/v1/auth/refresh`,
          refreshToken ? {refreshToken} : {},
          {withCredentials: true},
        );

        const {accessToken, refreshToken: nextRefreshToken} = response.data as {
          accessToken: string;
          refreshToken?: string;
        };
        setAuth(accessToken, nextRefreshToken ?? refreshToken ?? undefined);

        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export const customInstance = async <T>(
  url: string,
  options?: any,
): Promise<T> => {
  const response = await api({
    url,
    method: options?.method || 'GET',
    data: options?.body,
    params: options?.params,
    headers: options?.headers,
  });

  return response.data;
};

export type ErrorType<Error> = Error;
