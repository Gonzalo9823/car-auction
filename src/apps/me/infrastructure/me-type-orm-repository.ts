import { injectable } from 'inversify';

import { ContextErrorType, CustomError, ErrorCode, ErrorType } from 'apps/core/CustomError';
import { UUID } from 'apps/core/domain/uuid';
import { Me } from 'apps/me/domain/me';
import { MeDBRepository } from 'apps/me/domain/me-db-repository';

import { AppDataSource } from 'infrastructure/typeorm';
import { UserModel } from 'infrastructure/typeorm/entities/User';
import { UserTransformer } from 'infrastructure/typeorm/transformers/User';

@injectable()
export class MeTypeORMRepository implements MeDBRepository {
  async findMyData(id: UUID): Promise<Me> {
    const me = await AppDataSource.getRepository(UserModel).findOne({
      where: {
        id,
      },
    });

    if (!me) throw new CustomError(ErrorType.NotFound, ErrorCode.DataNotFound, [{ type: ContextErrorType.NotFound, path: 'me' }]);

    return UserTransformer.toDomain(me, 'User');
  }
}
