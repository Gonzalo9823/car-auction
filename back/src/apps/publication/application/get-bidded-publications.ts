import { inject, injectable } from 'inversify';

import { TYPES } from 'apps/core/container/injection-types';
import { User } from 'apps/core/domain/user';
import { Publication } from 'apps/publication/domain/publication';
import { PublicationDBRepository } from 'apps/publication/domain/publication-db-repository';

@injectable()
export class GetBiddedPublications {
  constructor(@inject(TYPES.PublicationDBRepository) private readonly publicationDBRepository: PublicationDBRepository) {}

  async execute(user: User): Promise<Publication[]> {
    return this.publicationDBRepository.findBidded(user);
  }
}
