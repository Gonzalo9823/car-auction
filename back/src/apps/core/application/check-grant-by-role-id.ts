import { inject, injectable } from 'inversify';

import { TYPES } from 'apps/core/container/injection-types';
import { AvailableGrant } from 'apps/core/domain/grant';
import { GrantDBRepository } from 'apps/core/domain/grant-db-repository';
import { UUID } from 'apps/core/domain/uuid';

@injectable()
export class CheckGrantByRoleId {
  constructor(@inject(TYPES.GrantDBRepository) private readonly grantDBRepository: GrantDBRepository) {}

  async execute(roleId: UUID, grant: AvailableGrant): Promise<void> {
    await this.grantDBRepository.checkByRoleId(roleId, grant);
  }
}
