import { injectable } from 'inversify';

import { Bid } from 'apps/bid/domain/bid';
import { BidDBRepository } from 'apps/bid/domain/bid-db-repository';
import { User } from 'apps/core/domain/user';
import { UUID } from 'apps/core/domain/uuid';
import { Publication } from 'apps/publication/domain/publication';

import { AppDataSource } from 'infrastructure/typeorm';
import { BidModel } from 'infrastructure/typeorm/entities/Bid';
import { ErrorHandler } from 'infrastructure/typeorm/ErrorHandler';
import { BidTransformer } from 'infrastructure/typeorm/transformers/Bid';
import { PublicationTransformer } from 'infrastructure/typeorm/transformers/Publication';
import { UserTransformer } from 'infrastructure/typeorm/transformers/User';

@injectable()
export class BidTypeORMRepository implements BidDBRepository {
  async create(user: User, publication: Publication, amount: number): Promise<Bid> {
    const newBid = new BidModel();

    await this.addDataToBid(newBid, user, publication, amount);

    return BidTransformer.toDomain(newBid, true);
  }

  async findManyMine(user: User): Promise<Bid[]> {
    const bids = await this.getManyMineBids(user);

    return bids.map((bid) => BidTransformer.toDomain(bid, true));
  }

  async findBiggestPublicationBid(publicationId: UUID): Promise<Bid | undefined> {
    const bids = await this.getManyByPublicationId(publicationId);
    const bid = bids[0];

    if (!bid) return undefined;
    return BidTransformer.toDomain(bid, true);
  }

  // Private Methods
  private async addDataToBid(bid: BidModel, user: User, publication: Publication, amount: number): Promise<void> {
    try {
      bid.publication = PublicationTransformer.toInfrastructure(publication);
      bid.bidder = UserTransformer.toInfrastructure(user, 'User');
      bid.amount = amount;
      bid.biddedAt = new Date();

      await AppDataSource.getRepository(BidModel).save(bid);
    } catch (err) {
      throw ErrorHandler(err);
    }
  }

  private async getManyMineBids(user: User): Promise<BidModel[]> {
    const bids = await AppDataSource.getRepository(BidModel).find({
      relations: {
        bidder: true,
        publication: {
          vehicle: true,
        },
      },
      where: {
        bidder: {
          id: user.id,
        },
      },
    });

    return bids;
  }

  private async getManyByPublicationId(id: UUID): Promise<BidModel[]> {
    const bids = await AppDataSource.getRepository(BidModel).find({
      relations: {
        bidder: true,
        publication: {
          vehicle: true,
        },
      },
      where: {
        publication: {
          id,
        },
      },
      order: {
        amount: 'DESC',
      },
    });

    return bids;
  }
}
