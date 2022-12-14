import { injectable } from 'inversify';

import { ContextErrorType, CustomError, ErrorCode, ErrorType } from 'apps/core/CustomError';
import { UUID } from 'apps/core/domain/uuid';
import { AvailableRole, Role } from 'apps/role/domain/role';
import { RoleDBRepository } from 'apps/role/domain/role-db-repository';

import { AppDataSource } from 'infrastructure/typeorm';
import { RoleModel } from 'infrastructure/typeorm/entities/Role';
import { RoleTransformer } from 'infrastructure/typeorm/transformers/Role';

@injectable()
export class RoleTypeORMRepository implements RoleDBRepository {
  async findById(id: UUID): Promise<Role> {
    const role = await AppDataSource.getRepository(RoleModel).findOne({
      where: {
        id,
      },
    });

    if (!role) throw new CustomError(ErrorType.NotFound, ErrorCode.DataNotFound, [{ type: ContextErrorType.NotFound, path: 'Role' }]);

    return RoleTransformer.toDomain(role);
  }

  async findByName(name: AvailableRole): Promise<Role> {
    const role = await AppDataSource.getRepository(RoleModel).findOne({
      where: {
        name,
      },
    });

    if (!role) throw new CustomError(ErrorType.NotFound, ErrorCode.DataNotFound, [{ type: ContextErrorType.NotFound, path: 'Role' }]);

    return RoleTransformer.toDomain(role);
  }
}
