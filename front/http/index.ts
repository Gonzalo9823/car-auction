import axios, { AxiosRequestConfig } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { setCookie, getCookie } from 'cookies-next';

export const http = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: false,
});

export const fetcher = (url: string) => http.get(url).then((res) => res.data);

createAuthRefreshInterceptor(http, async (failedRequest) => {
  try {
    const { data } = await axios.post<{ accessToken: string }>('http://localhost:3000/api/auth/refresh', {});
    const { accessToken } = data;

    failedRequest.response.config.headers.Authorization = `Bearer ${accessToken}`;

    setCookie('a_token', accessToken, { path: '/', secure: false });

    return Promise.resolve();
  } catch (err) {
    return Promise.reject();
  }
});

http.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = getCookie('a_token');

  if (token && !config.headers?.Authorization) {
    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      config.headers = { Authorization: `Bearer ${token}` };
    }
  }

  return config;
});
