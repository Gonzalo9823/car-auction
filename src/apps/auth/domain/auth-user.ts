import { Role } from 'apps/role/domain/role';
import { User } from 'apps/core/domain/user';

export interface AuthUser extends User {
  encryptedPassword: string;
  role: Role;
}
