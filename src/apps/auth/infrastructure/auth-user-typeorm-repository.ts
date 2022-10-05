import { injectable } from 'inversify';
import { Raw } from 'typeorm';

import { AuthUser } from 'apps/auth/domain/auth-user';
import { AuthUserDBRepository, CreateUserDto } from 'apps/auth/domain/auth-user-db-repository';
import { ContextErrorType, CustomError, ErrorCode, ErrorType } from 'apps/core/CustomError';
import { RefreshToken } from 'apps/core/domain/token';
import { UUID } from 'apps/core/domain/uuid';

import { AppDataSource } from 'infrastructure/typeorm';
import { RefreshTokenModel } from 'infrastructure/typeorm/entities/RefreshToken';
import { UserModel } from 'infrastructure/typeorm/entities/User';
import { ErrorHandler } from 'infrastructure/typeorm/ErrorHandler';
import { RoleTransformer } from 'infrastructure/typeorm/transformers/Role';
import { UserTransformer } from 'infrastructure/typeorm/transformers/User';

@injectable()
export class AuthUserTypeORMRepository implements AuthUserDBRepository {
  async create(userData: CreateUserDto): Promise<void> {
    const newUser = new UserModel();

    await this.addDataToUser(newUser, userData);
  }

  async findByEmail(email: string): Promise<AuthUser> {
    const authUser = await this.getAuthUserByEmail(email);

    return UserTransformer.toDomain<AuthUser>(authUser, 'AuthUser');
  }

  async findById(id: UUID): Promise<AuthUser> {
    const authUser = await this.getAuthUserById(id);

    return UserTransformer.toDomain<AuthUser>(authUser, 'AuthUser');
  }

  async addRefreshToken(id: UUID, refreshToken: RefreshToken): Promise<void> {
    const authUser = await this.getAuthUserById(id);

    await this.addRefreshTokenToUser(authUser, refreshToken);
  }

  async isRefreshTokenValid(id: UUID, refreshToken: RefreshToken): Promise<boolean> {
    const authUser = await this.getAuthUserById(id);

    const isValid = await this.checkIfRefreshTokenIsValid(authUser, refreshToken);

    return isValid;
  }

  async removeRefreshToken(id: UUID, refreshToken: RefreshToken, shouldInvalidate: boolean): Promise<void> {
    const authUser = await this.getAuthUserById(id);

    await this.removeRefreshTokenFromUser(authUser, refreshToken, shouldInvalidate);
  }

  // Private Methods
  async addDataToUser(user: UserModel, userData: CreateUserDto): Promise<void> {
    try {
      const { name, phone, email, encryptedPassword, role } = userData;

      user.name = name;
      user.phone = phone;
      user.email = email;
      user.encryptedPassword = encryptedPassword;
      user.role = RoleTransformer.toInfrastructure(role);
      user.refreshTokens = [];
      user.favorites = [];

      await AppDataSource.getRepository(UserModel).save(user);
    } catch (err) {
      throw ErrorHandler(err);
    }
  }

  async getAuthUserByEmail(email: string): Promise<UserModel> {
    const authUser = await AppDataSource.getRepository(UserModel).findOne({
      relations: {
        role: true,
      },
      where: {
        email,
      },
    });

    if (!authUser) throw new CustomError(ErrorType.NotFound, ErrorCode.DataNotFound, [{ type: ContextErrorType.NotFound, path: 'authUser' }]);

    return authUser;
  }

  async getAuthUserById(id: UUID): Promise<UserModel> {
    const authUser = await AppDataSource.getRepository(UserModel).findOne({
      relations: {
        role: true,
      },
      where: {
        id,
      },
    });

    if (!authUser) throw new CustomError(ErrorType.NotFound, ErrorCode.DataNotFound, [{ type: ContextErrorType.NotFound, path: 'authUser' }]);

    return authUser;
  }

  async addRefreshTokenToUser(user: UserModel, refreshToken: RefreshToken): Promise<void> {
    try {
      const newRefreshToken = new RefreshTokenModel();

      newRefreshToken.token = refreshToken;
      newRefreshToken.user = user;

      await AppDataSource.getRepository(RefreshTokenModel).save(newRefreshToken);
    } catch (err) {
      throw ErrorHandler(err);
    }
  }

  async checkIfRefreshTokenIsValid(user: UserModel, refreshToken: RefreshToken): Promise<boolean> {
    try {
      const _refreshToken = await AppDataSource.getRepository(RefreshTokenModel).findOne({
        where: {
          user: {
            id: user.id,
          },
          token: refreshToken,
          deletedAt: Raw((deletedAt) => `${deletedAt} IS NULL OR now() <= ${deletedAt} + interval '1 minutes'`),
        },
      });

      return _refreshToken !== null;
    } catch (err) {
      throw ErrorHandler(err);
    }
  }

  async removeRefreshTokenFromUser(user: UserModel, refreshToken: RefreshToken, shouldInvalidate: boolean): Promise<void> {
    try {
      if (shouldInvalidate) {
        await AppDataSource.getRepository(RefreshTokenModel)
          .createQueryBuilder()
          .softDelete()
          .where('refresh_tokens.user_id = :id AND refresh_tokens.token = :token', { id: user.id, token: refreshToken })
          .execute();
      } else {
        await AppDataSource.createQueryBuilder()
          .delete()
          .from(RefreshTokenModel)
          .where('refresh_tokens.user_id = :id AND refresh_tokens.token = :token', { id: user.id, token: refreshToken })
          .execute();
      }
    } catch (err) {
      throw ErrorHandler(err);
    }
  }
}
