import { inject, injectable } from 'inversify';

import { TYPES } from 'apps/core/container/injection-types';
import { UUID } from 'apps/core/domain/uuid';
import { Role } from 'apps/role/domain/role';
import { RoleDBRepository } from 'apps/role/domain/role-db-repository';

@injectable()
export class GetRoleById {
  constructor(@inject(TYPES.RoleDBRepository) private readonly roleDBRepository: RoleDBRepository) {}

  async execute(id: UUID): Promise<Role> {
    return this.roleDBRepository.findById(id);
  }
}
