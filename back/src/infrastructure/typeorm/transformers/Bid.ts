import { Bid } from 'apps/bid/domain/bid';
import { ContextErrorType, CustomError, ErrorCode, ErrorType } from 'apps/core/CustomError';
import { PartialBy } from 'apps/core/util/partialBy';

import { BidModel } from 'infrastructure/typeorm/entities/Bid';
import { PublicationModel } from 'infrastructure/typeorm/entities/Publication';
import { UserTransformer } from 'infrastructure/typeorm/transformers/User';
import { VehicleTransformer } from 'infrastructure/typeorm/transformers/Vehicle';

export class BidTransformer {
  static toDomain<T extends Bid & Omit<Bid, 'publication'>>(bid: PartialBy<BidModel, 'bidder' | 'publication'>, withPublication: boolean): T {
    const { id, bidder, biddedAt, amount, publication } = bid;

    if (!bidder) {
      throw new CustomError(ErrorType.InternalServerError, ErrorCode.CantTransformInfrastructureToDomain, [
        { type: ContextErrorType.Transformer, path: 'Bid' },
        { type: ContextErrorType.InvalidData, path: 'Bid/Bidder' },
      ]);
    }

    const basePublication = {
      id,
      bidder: UserTransformer.toDomain(bidder, 'User'),
      biddedAt,
      amount,
    };

    if (withPublication) {
      if (!publication) {
        throw new CustomError(ErrorType.InternalServerError, ErrorCode.CantTransformInfrastructureToDomain, [
          { type: ContextErrorType.Transformer, path: 'Bid' },
          { type: ContextErrorType.InvalidData, path: 'Bid/Publication' },
        ]);
      }

      return {
        ...basePublication,
        publication: {
          id: publication.id,
          vehicle: VehicleTransformer.toDomain(publication.vehicle, false, false),
        },
      } as T;
    }

    return basePublication as T;
  }

  static toInfrastructure(bid: PartialBy<Bid, 'publication'>): BidModel {
    const { bidder, biddedAt, amount, publication } = bid;

    const bidModel = new BidModel();

    bidModel.bidder = UserTransformer.toInfrastructure(bidder, 'User');
    bidModel.biddedAt = biddedAt;
    bidModel.amount = amount;

    if (publication) {
      const bidPublicationModel = new PublicationModel();

      bidPublicationModel.id = publication.id;
      bidPublicationModel.vehicle = VehicleTransformer.toInfrastructure(publication.vehicle);

      bidModel.publication = bidPublicationModel;
    }

    return bidModel;
  }
}
