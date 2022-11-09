export type RefreshToken = string;
export type AccessToken = string;

interface TokenData {
  id: string;
  roleId: string;
}

export interface AccessTokenData extends TokenData {
  access: boolean;
}

export interface RefreshTokenData extends TokenData {
  refresh: boolean;
}

export interface DecodedTokenData {
  id: string;
  roleId: string;
}
