import axios from 'axios';
import {useAuthStore} from '../store/useAuthStore';

export const api = axios.create({
  baseURL: 'https://rbxepeq442.eu-central-1.awsapprunner.com',
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  response => response,

  error => {
    if (error.response?.status === 401) {
      const {isAuth, logout} = useAuthStore.getState();

      if (isAuth) {
        logout();
      }
    }

    return Promise.reject(error);
  },
);

export const customInstance = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  const response = await api({
    url,
    method: options?.method,
    data: options?.body,
    headers: options?.headers as any,
  });

  return response.data;
};

export type ErrorType<Error> = Error;
