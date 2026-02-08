import axios from 'axios';
import type {AxiosResponse, AxiosRequestConfig} from 'axios';

export const api = axios.create({
  baseURL: 'https://rbxepeq442.eu-central-1.awsapprunner.com',
  withCredentials: true,
});

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  return api({
    ...config,
    ...options,
  }).then((response: AxiosResponse<T>) => response.data);
};

export type ErrorType<Error> = Error;
