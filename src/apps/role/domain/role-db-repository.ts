import { UUID } from 'apps/core/domain/uuid';
import { Role } from 'apps/role/domain/role';

export interface RoleDBRepository {
  findById(id: UUID): Promise<Role>;
}
