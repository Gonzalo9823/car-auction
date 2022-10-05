import { AuthUser } from 'apps/auth/domain/auth-user';
import { ContextErrorType, CustomError, ErrorCode, ErrorType } from 'apps/core/CustomError';
import { User } from 'apps/core/domain/user';
import { PartialBy } from 'apps/core/util/partialBy';

import { UserModel } from 'infrastructure/typeorm/entities/User';
import { RoleTransformer } from 'infrastructure/typeorm/transformers/Role';

export class UserTransformer {
  static toDomain<T extends User | AuthUser>(user: PartialBy<UserModel, 'role'>, type: 'User' | 'AuthUser'): T {
    const { id, name, phone, email, encryptedPassword, role } = user;

    const baseUser = {
      id,
      name,
      phone,
      email,
    };

    if (type === 'AuthUser') {
      if (!role) {
        throw new CustomError(ErrorType.InternalServerError, ErrorCode.CantTransformInfrastructureToDomain, [
          { type: ContextErrorType.Transformer, path: 'User/AuthUser' },
          { type: ContextErrorType.InvalidData, path: 'User/AuthUser/role' },
        ]);
      }

      return {
        ...baseUser,
        encryptedPassword,
        role: RoleTransformer.toDomain(role),
      } as T;
    }

    return baseUser as T;
  }

  static toInfrastructure<T extends User | AuthUser>(user: T, type: 'User' | 'AuthUser'): UserModel {
    const { id, name, phone, email } = user;

    const userModel = new UserModel();

    userModel.id = id;
    userModel.name = name;
    userModel.phone = phone;
    userModel.email = email;

    if (type === 'AuthUser') {
      const { encryptedPassword, role } = user as AuthUser;

      userModel.encryptedPassword = encryptedPassword;
      userModel.role = RoleTransformer.toInfrastructure(role);
    }

    return userModel;
  }
}
