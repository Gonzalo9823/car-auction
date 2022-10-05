import { AvailableGrant } from 'apps/core/domain/grant';

export interface GrantDBRepository {
  checkByRoleId(roleId: string, grant: AvailableGrant): Promise<void>;
}
