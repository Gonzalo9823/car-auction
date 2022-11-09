import { AxiosError } from 'axios';

export const checkIfError = (error?: AxiosError) => {
  if (error?.isAxiosError && error.response?.status !== 401) {
    return error;
  }

  return undefined;
};
