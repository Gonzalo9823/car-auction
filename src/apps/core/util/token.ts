import jwt, { TokenExpiredError } from 'jsonwebtoken';

import { AuthUser } from 'apps/auth/domain/auth-user';
import { CustomError, ErrorCode, ErrorType } from 'apps/core/CustomError';
import { AccessTokenData, DecodedTokenData, RefreshTokenData } from 'apps/core/domain/token';

import config from '@/config';

export const needsAccessToken = (authorizationString?: string): DecodedTokenData => {
  if (!authorizationString || !authorizationString.startsWith('Bearer')) {
    throw new CustomError(ErrorType.Unauthorized, ErrorCode.NoTokenSent);
  }

  const accessToken = authorizationString.slice(7).trim();

  const { id, roleId, access } = verifyAccessToken(accessToken);

  if (!id || !roleId || !access) throw new CustomError(ErrorType.Unauthorized, ErrorCode.InvalidToken);

  return { id, roleId };
};

export const needsRefreshToken = (refreshToken?: string): DecodedTokenData => {
  if (!refreshToken) throw new CustomError(ErrorType.Unauthorized, ErrorCode.NoTokenSent);

  const { id, roleId, refresh } = verifyRefreshToken(refreshToken);

  if (!id || !roleId || !refresh) throw new CustomError(ErrorType.Unauthorized, ErrorCode.InvalidToken);

  return { id, roleId };
};

const verifyAccessToken = (token: string): AccessTokenData => {
  try {
    const { id, roleId, access } = jwt.verify(token, config.ACCESS_TOKEN_SECRET) as AccessTokenData;
    return {
      id,
      roleId,
      access,
    };
  } catch (err) {
    const message = err instanceof TokenExpiredError ? ErrorCode.ExpiredToken : ErrorCode.InvalidToken;
    throw new CustomError(ErrorType.Unauthorized, message);
  }
};

const verifyRefreshToken = (token: string): RefreshTokenData => {
  try {
    const { id, roleId, refresh } = jwt.verify(token, config.REFRESH_TOKEN_SECRET) as RefreshTokenData;
    return {
      id,
      roleId,
      refresh,
    };
  } catch (err) {
    const message = err instanceof TokenExpiredError ? ErrorCode.ExpiredToken : ErrorCode.InvalidToken;
    throw new CustomError(ErrorType.Unauthorized, message);
  }
};

export const generateAccessToken = (user: AuthUser): string => {
  const tokenData: AccessTokenData = {
    id: user.id,
    roleId: user.role.id,
    access: true,
  };

  return jwt.sign(tokenData, config.ACCESS_TOKEN_SECRET, {
    expiresIn: '3m',
  });
};

export const generateRefreshToken = (user: AuthUser): string => {
  const tokenData: RefreshTokenData = {
    id: user.id,
    roleId: user.role.id,
    refresh: true,
  };

  return jwt.sign(tokenData, config.REFRESH_TOKEN_SECRET, {
    expiresIn: '5d',
  });
};
