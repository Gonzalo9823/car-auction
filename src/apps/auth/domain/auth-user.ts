import { User } from 'apps/core/domain/user';
import { Role } from 'apps/role/domain/role';

export interface AuthUser extends User {
  encryptedPassword: string;
  role: Role;
}
