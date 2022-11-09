import { inject, injectable } from 'inversify';

import { Bid } from 'apps/bid/domain/bid';
import { BidDBRepository } from 'apps/bid/domain/bid-db-repository';
import { TYPES } from 'apps/core/container/injection-types';
import { UUID } from 'apps/core/domain/uuid';

@injectable()
export class GetBiggestBidByPublicationId {
  constructor(@inject(TYPES.BidDBRepository) private readonly bidDBRepository: BidDBRepository) {}

  async execute(publicationId: UUID): Promise<Bid | undefined> {
    return this.bidDBRepository.findBiggestPublicationBid(publicationId);
  }
}
