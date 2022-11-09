import { UUID } from 'apps/core/domain/uuid';
import { AvailableRole, Role } from 'apps/role/domain/role';

export interface RoleDBRepository {
  findById(id: UUID): Promise<Role>;
  findByName(name: AvailableRole): Promise<Role>;
}
