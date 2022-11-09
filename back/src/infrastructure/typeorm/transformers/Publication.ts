import { ContextErrorType, CustomError, ErrorCode, ErrorType } from 'apps/core/CustomError';
import { PartialBy } from 'apps/core/util/partialBy';
import { Publication } from 'apps/publication/domain/publication';

import { PublicationModel } from 'infrastructure/typeorm/entities/Publication';
import { BidTransformer } from 'infrastructure/typeorm/transformers/Bid';
import { UserTransformer } from 'infrastructure/typeorm/transformers/User';
import { VehicleTransformer } from 'infrastructure/typeorm/transformers/Vehicle';

export class PublicationTransformer {
  static toDomain(publication: PartialBy<PublicationModel, 'user' | 'vehicle' | 'bids'>): Publication {
    const { id, user, vehicle, winner, bids, endDate } = publication;

    if (!user) {
      throw new CustomError(ErrorType.InternalServerError, ErrorCode.CantTransformInfrastructureToDomain, [
        { type: ContextErrorType.Transformer, path: 'Publication' },
        { type: ContextErrorType.InvalidData, path: 'Publication/User' },
      ]);
    }

    if (!vehicle) {
      throw new CustomError(ErrorType.InternalServerError, ErrorCode.CantTransformInfrastructureToDomain, [
        { type: ContextErrorType.Transformer, path: 'Publication' },
        { type: ContextErrorType.InvalidData, path: 'Publication/Vehicle' },
      ]);
    }

    if (!bids) {
      throw new CustomError(ErrorType.InternalServerError, ErrorCode.CantTransformInfrastructureToDomain, [
        { type: ContextErrorType.Transformer, path: 'Publication' },
        { type: ContextErrorType.InvalidData, path: 'Publication/Bids' },
      ]);
    }

    return {
      id,
      user: UserTransformer.toDomain(user, 'User'),
      vehicle: VehicleTransformer.toDomain(vehicle, false, false),
      winner: winner ? UserTransformer.toDomain(winner, 'User') : undefined,
      bids: bids.map((bid) => BidTransformer.toDomain(bid, false)),
      endDate,
    };
  }

  static toInfrastructure(publication: Publication): PublicationModel {
    const { id, user, vehicle, winner, bids, endDate } = publication;

    const publicationModel = new PublicationModel();

    publicationModel.id = id;
    publicationModel.user = UserTransformer.toInfrastructure(user, 'User');
    publicationModel.vehicle = VehicleTransformer.toInfrastructure(vehicle);

    if (winner) {
      publicationModel.winner = UserTransformer.toInfrastructure(winner, 'User');
    }

    publicationModel.bids = bids.map((bid) => BidTransformer.toInfrastructure(bid));
    publicationModel.endDate = endDate;

    return publicationModel;
  }
}
