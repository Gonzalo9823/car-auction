import { inject, injectable } from 'inversify';

import { TYPES } from 'apps/core/container/injection-types';
import { UUID } from 'apps/core/domain/uuid';
import { Me } from 'apps/me/domain/me';
import { MeDBRepository, UpdateMeDto } from 'apps/me/domain/me-db-repository';

@injectable()
export class UpdateMyData {
  constructor(@inject(TYPES.MeDBRepository) private readonly meDBRepository: MeDBRepository) {}

  async execute(id: UUID, meData: UpdateMeDto): Promise<Me> {
    return this.meDBRepository.update(id, meData);
  }
}
