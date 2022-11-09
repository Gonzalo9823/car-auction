import { inject, injectable } from 'inversify';

import { TYPES } from 'apps/core/container/injection-types';
import { AvailableRole, Role } from 'apps/role/domain/role';
import { RoleDBRepository } from 'apps/role/domain/role-db-repository';

@injectable()
export class GetRoleByName {
  constructor(@inject(TYPES.RoleDBRepository) private readonly roleDBRepository: RoleDBRepository) {}

  async execute(name: AvailableRole): Promise<Role> {
    return this.roleDBRepository.findByName(name);
  }
}
