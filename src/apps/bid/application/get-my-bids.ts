import { inject, injectable } from 'inversify';

import { Bid } from 'apps/bid/domain/bid';
import { BidDBRepository } from 'apps/bid/domain/bid-db-repository';
import { TYPES } from 'apps/core/container/injection-types';
import { User } from 'apps/core/domain/user';

@injectable()
export class GetMyBids {
  constructor(@inject(TYPES.BidDBRepository) private readonly bidDBRepository: BidDBRepository) {}

  async execute(user: User): Promise<Bid[]> {
    return this.bidDBRepository.findManyMine(user);
  }
}
