import axios from "axios";

export const api = axios.create({
  baseURL: "https://rbxepeq442.eu-central-1.awsapprunner.com",
  withCredentials: true,
});

export const customInstance = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const response = await api({
    url,
    method: options?.method as any,
    data: options?.body,
    headers: options?.headers as any,
  });

  return response.data;
};

export type ErrorType<Error> = Error;
