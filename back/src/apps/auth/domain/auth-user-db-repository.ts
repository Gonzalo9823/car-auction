import { AuthUser } from 'apps/auth/domain/auth-user';
import { RefreshToken } from 'apps/core/domain/token';
import { UUID } from 'apps/core/domain/uuid';
import { Role } from 'apps/role/domain/role';

export interface CreateUserDto {
  name: string;
  phone: string;
  email: string;
  encryptedPassword: string;
  role: Role;
}

export interface AuthUserDBRepository {
  create(userData: CreateUserDto): Promise<void>;
  findByEmail(email: string): Promise<AuthUser>;
  findById(id: UUID): Promise<AuthUser>;
  addRefreshToken(id: UUID, refreshToken: RefreshToken): Promise<void>;
  isRefreshTokenValid(id: UUID, refreshToken: RefreshToken): Promise<boolean>;
  removeRefreshToken(id: UUID, refreshToken: RefreshToken, shouldInvalidate: boolean): Promise<void>;
}
