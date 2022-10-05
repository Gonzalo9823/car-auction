import jwt from 'jsonwebtoken';

import { AuthUser } from 'apps/auth/domain/auth-user';
import { AccessTokenData, RefreshTokenData } from 'apps/auth/domain/token';

import config from '@/config';

export const generateAccessToken = (user: AuthUser) => {
  const tokenData: AccessTokenData = {
    id: user.id,
    roleId: user.role.id,
    access: true,
  };

  return jwt.sign(tokenData, config.ACCESS_TOKEN_SECRET, {
    expiresIn: '3m',
  });
};

export const generateRefreshToken = (user: AuthUser) => {
  const tokenData: RefreshTokenData = {
    id: user.id,
    roleId: user.role.id,
    refresh: true,
  };

  return jwt.sign(tokenData, config.REFRESH_TOKEN_SECRET, {
    expiresIn: '5d',
  });
};
