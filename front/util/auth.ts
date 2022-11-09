import { GetServerSideProps, GetServerSidePropsContext } from 'next/types';
import axios from 'axios';
import { setCookie, getCookies, deleteCookie } from 'cookies-next';
import { shouldAskForAccessToken } from './token';
import { http } from '../http';
import { User } from '../interfaces/User';

export const checkIfAlreadyAuth: GetServerSideProps = async (ctx) => {
  const { query, req } = ctx;
  const cookies = getCookies({ req });
  const refreshToken = cookies['r_token'];

  if (refreshToken) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }

  return {
    props: {
      query,
    },
  };
};

export const getInitialData = async (ctx: GetServerSidePropsContext) => {
  const { query, resolvedUrl } = ctx;

  try {
    const isLogged = await authorize(ctx);
    let user: User | null = null;

    if (isLogged !== undefined) {
      const { data } = await http.get<{ me: User }>('/me');
      user = data.me;
    }

    return {
      props: {
        isLogged: isLogged !== undefined,
        user,
        query,
      },
    };
  } catch (err) {
    let destination = '/';

    if (err instanceof Error) {
      if (err.message === 'NeedsAuth') destination += `?logged=false&nextPage=${resolvedUrl}`;
    }

    return {
      redirect: {
        permanent: false,
        destination,
      },
    };
  }
};

const authorize = async (ctx: GetServerSidePropsContext) => {
  const { req, res } = ctx;

  if (req) {
    const cookies = getCookies({ req, res });

    try {
      const refreshToken = cookies['r_token'];
      const accessToken = cookies['a_token'];
      const askForAccessToken = shouldAskForAccessToken(accessToken);

      if (!refreshToken) return undefined;

      if (askForAccessToken) {
        const { data, headers } = await axios.post(
          `${process.env.API_URL}auth/refresh`,
          {},
          {
            headers: {
              Cookie: `r_token=${refreshToken};`,
            },
          }
        );

        if (!headers['set-cookie']) throw new Error('Error on Cookies.');

        const newRefreshToken = headers['set-cookie'][0].split(';')[0].split('r_token=')[1];
        const { accessToken: newAccessToken } = data;

        http.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

        setCookie('a_token', newAccessToken, { req, res, path: '/', secure: false });
        setCookie('r_token', newRefreshToken, { req, res, httpOnly: true, maxAge: 60 * 60 * 24 * 7, sameSite: true, secure: false, path: '/' });
        return true;
      } else {
        http.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        return true;
      }
    } catch (err) {
      deleteCookie('a_token', { req, res });
      deleteCookie('r_token', { req, res });
      throw err;
    }
  }
};
