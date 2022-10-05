import { inject, injectable } from 'inversify';

import { TYPES } from 'apps/core/container/injection-types';
import { UUID } from 'apps/core/domain/uuid';
import { Publication } from 'apps/publication/domain/publication';
import { PublicationDBRepository } from 'apps/publication/domain/publication-db-repository';

@injectable()
export class GetPublicationsByVehicleId {
  constructor(@inject(TYPES.PublicationDBRepository) private readonly publicationDBRepository: PublicationDBRepository) {}

  async execute(id: UUID): Promise<Publication[]> {
    return this.publicationDBRepository.findManyByVehicleId(id);
  }
}
