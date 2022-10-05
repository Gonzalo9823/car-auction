import { inject, injectable } from 'inversify';

import { GetBiggestBidByPublicationId } from 'apps/bid/application/get-biggest-bid-by-publication-id';
import { Bid } from 'apps/bid/domain/bid';
import { BidDBRepository } from 'apps/bid/domain/bid-db-repository';
import { TYPES } from 'apps/core/container/injection-types';
import { CustomError, ErrorCode, ErrorType } from 'apps/core/CustomError';
import { User } from 'apps/core/domain/user';
import { UUID } from 'apps/core/domain/uuid';
import { GetPublicationById } from 'apps/publication/application/get-publication-by-id';

@injectable()
export class CreateBid {
  constructor(
    @inject(TYPES.BidDBRepository) private readonly bidDBRepository: BidDBRepository,
    @inject(TYPES.GetPublicationById) private readonly getPublicationById: GetPublicationById,
    @inject(TYPES.GetBiggestBidByPublicationId) private readonly getBiggestBidByPublicationId: GetBiggestBidByPublicationId
  ) {}

  async execute(user: User, publicationId: UUID, amount: number): Promise<Bid> {
    const publication = await this.getPublicationById.execute(publicationId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (publication.user.id === user.id) {
      throw new CustomError(ErrorType.Validation, ErrorCode.CantBidOnOwnPublication);
    }

    if (publication.endDate <= today) {
      throw new CustomError(ErrorType.MethodNotAllowed, ErrorCode.PublicationHasEnded);
    }

    const biggestBid = await this.getBiggestBidByPublicationId.execute(publication.id);

    if (biggestBid && biggestBid.amount >= amount) {
      throw new CustomError(ErrorType.Validation, ErrorCode.BidSmallerThanBiggest);
    }

    return this.bidDBRepository.create(user, publication, amount);
  }
}
