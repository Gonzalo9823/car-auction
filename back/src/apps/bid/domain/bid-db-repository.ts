import { Bid } from 'apps/bid/domain/bid';
import { User } from 'apps/core/domain/user';
import { UUID } from 'apps/core/domain/uuid';
import { Publication } from 'apps/publication/domain/publication';

export interface BidDBRepository {
  create(user: User, publication: Publication, amount: number): Promise<Bid>;
  findManyMine(user: User): Promise<Bid[]>;
  findBiggestPublicationBid(publicationId: UUID): Promise<Bid | undefined>;
}
