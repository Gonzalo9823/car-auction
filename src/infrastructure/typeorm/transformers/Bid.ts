import { Bid } from 'apps/bid/domain/bid';
import { ContextErrorType, CustomError, ErrorCode, ErrorType } from 'apps/core/CustomError';
import { PartialBy } from 'apps/core/util/partialBy';

import { BidModel } from 'infrastructure/typeorm/entities/Bid';
import { UserTransformer } from 'infrastructure/typeorm/transformers/User';

export class BidTransformer {
  static toDomain(bid: PartialBy<BidModel, 'bidder'>): Bid {
    const { id, bidder, biddedAt, amount } = bid;

    if (!bidder) {
      throw new CustomError(ErrorType.InternalServerError, ErrorCode.CantTransformInfrastructureToDomain, [
        { type: ContextErrorType.Transformer, path: 'Bid' },
        { type: ContextErrorType.InvalidData, path: 'Bid/Bidder' },
      ]);
    }

    return {
      id,
      bidder: UserTransformer.toDomain(bidder, 'User'),
      biddedAt,
      amount,
    };
  }

  static toInfrastructure(bid: Bid): BidModel {
    const { bidder, biddedAt, amount } = bid;

    const bidModel = new BidModel();

    bidModel.bidder = UserTransformer.toInfrastructure(bidder, 'User');
    bidModel.biddedAt = biddedAt;
    bidModel.amount = amount;

    return bidModel;
  }
}
