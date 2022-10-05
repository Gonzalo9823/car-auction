import { User } from 'apps/core/domain/user';
import { UUID } from 'apps/core/domain/uuid';

export interface Bid {
  id: UUID;
  bidder: User;
  biddedAt: Date;
  amount: number;
}
