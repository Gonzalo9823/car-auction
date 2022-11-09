import jwt_decode, { JwtPayload } from 'jwt-decode';

export const shouldAskForAccessToken = (token?: string) => {
  if (typeof token !== 'string' || !token) return true;

  const { exp } = jwt_decode<JwtPayload>(token);
  const currentTime = new Date().getTime() / 1000;

  if (exp && currentTime > exp) return true;

  return false;
};
