import { injectable } from 'inversify';

import { ContextErrorType, CustomError, ErrorCode, ErrorType } from 'apps/core/CustomError';
import { AvailableGrant } from 'apps/core/domain/grant';
import { GrantDBRepository } from 'apps/core/domain/grant-db-repository';

import { AppDataSource } from 'infrastructure/typeorm';
import { RoleModel } from 'infrastructure/typeorm/entities/Role';

@injectable()
export class GrantTypeORMRepository implements GrantDBRepository {
  async checkByRoleId(roleId: string, grant: AvailableGrant): Promise<void> {
    const roleGrant = await AppDataSource.getRepository(RoleModel).findOne({
      relations: {
        grants: true,
      },
      where: {
        id: roleId,
        grants: {
          name: grant,
        },
      },
    });

    if (!roleGrant) {
      throw new CustomError(ErrorType.Unauthorized, ErrorCode.UserDoesNotHaveGrant, [{ type: ContextErrorType.Grant, path: grant }]);
    }
  }
}
