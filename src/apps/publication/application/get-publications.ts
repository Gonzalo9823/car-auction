import { inject, injectable } from 'inversify';

import { TYPES } from 'apps/core/container/injection-types';
import { Publication } from 'apps/publication/domain/publication';
import { PublicationDBRepository } from 'apps/publication/domain/publication-db-repository';

@injectable()
export class GetPublications {
  constructor(@inject(TYPES.PublicationDBRepository) private readonly publicationDBRepository: PublicationDBRepository) {}

  async execute(): Promise<Publication[]> {
    return this.publicationDBRepository.findMany();
  }
}
