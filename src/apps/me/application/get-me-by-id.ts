import { inject, injectable } from 'inversify';

import { TYPES } from 'apps/core/container/injection-types';
import { UUID } from 'apps/core/domain/uuid';
import { Me } from 'apps/me/domain/me';
import { MeDBRepository } from 'apps/me/domain/me-db-repository';

@injectable()
export class GetMeById {
  constructor(@inject(TYPES.MeDBRepository) private readonly meDBRepository: MeDBRepository) {}

  async excute(id: UUID): Promise<Me> {
    return this.meDBRepository.findMyData(id);
  }
}
