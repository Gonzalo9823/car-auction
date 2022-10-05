import { Grant } from 'apps/core/domain/grant';

import { GrantModel } from 'infrastructure/typeorm/entities/Grant';

export class GrantTransformer {
  static toDomain(grant: GrantModel): Grant {
    const { id, name } = grant;

    return {
      id,
      name,
    };
  }

  static toInfrastructure(grant: Grant): GrantModel {
    const { id, name } = grant;

    const grantModel = new GrantModel();

    grantModel.id = id;
    grantModel.name = name;

    return grantModel;
  }
}
