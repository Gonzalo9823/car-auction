import { injectable } from 'inversify';

import { ContextErrorType, CustomError, ErrorCode, ErrorType } from 'apps/core/CustomError';
import { User } from 'apps/core/domain/user';
import { UUID } from 'apps/core/domain/uuid';
import { Me } from 'apps/me/domain/me';
import { MeDBRepository, UpdateMeDto } from 'apps/me/domain/me-db-repository';

import { AppDataSource } from 'infrastructure/typeorm';
import { UserModel } from 'infrastructure/typeorm/entities/User';
import { ErrorHandler } from 'infrastructure/typeorm/ErrorHandler';
import { UserTransformer } from 'infrastructure/typeorm/transformers/User';

@injectable()
export class MeTypeORMRepository implements MeDBRepository {
  async findMyData(id: UUID): Promise<Me> {
    const me = await this.getMe(id);

    return UserTransformer.toDomain(me, 'User');
  }

  async update(id: UUID, meData: UpdateMeDto): Promise<User> {
    const me = await this.getMe(id);

    await this.updateMyData(me, meData);

    return UserTransformer.toDomain(me, 'User');
  }

  async updatePassword(id: UUID, encryptedPassword: string): Promise<User> {
    const me = await this.getMe(id);

    await this.updateMyPassword(me, encryptedPassword);

    return UserTransformer.toDomain(me, 'User');
  }

  // Private Methods
  async getMe(id: UUID): Promise<UserModel> {
    const me = await AppDataSource.getRepository(UserModel).findOne({
      where: {
        id,
      },
    });

    if (!me) throw new CustomError(ErrorType.NotFound, ErrorCode.DataNotFound, [{ type: ContextErrorType.NotFound, path: 'me' }]);

    return me;
  }

  async updateMyData(user: UserModel, meData: UpdateMeDto): Promise<void> {
    try {
      const { name, phone, email } = meData;

      user.name = name;
      user.phone = phone;
      user.email = email;

      await AppDataSource.getRepository(UserModel).save(user);
    } catch (err) {
      throw ErrorHandler(err);
    }
  }

  async updateMyPassword(user: UserModel, encryptedPassword: string): Promise<void> {
    try {
      user.encryptedPassword = encryptedPassword;

      await AppDataSource.getRepository(UserModel).save(user);
    } catch (err) {
      throw ErrorHandler(err);
    }
  }
}
