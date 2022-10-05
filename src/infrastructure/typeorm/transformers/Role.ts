import { Role } from 'apps/role/domain/role';

import { RoleModel } from 'infrastructure/typeorm/entities/Role';

export class RoleTransformer {
  static toDomain(role: RoleModel): Role {
    const { id, name } = role;

    return {
      id,
      name,
    };
  }

  static toInfrastructure(role: Role): RoleModel {
    const { id, name } = role;

    const roleModel = new RoleModel();

    roleModel.id = id;
    roleModel.name = name;

    return roleModel;
  }
}
