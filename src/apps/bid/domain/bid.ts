import { User } from 'apps/core/domain/user';
import { UUID } from 'apps/core/domain/uuid';
import { Vehicle } from 'apps/vehicle/domain/vehicle';

export interface Bid {
  id: UUID;
  bidder: User;
  biddedAt: Date;
  amount: number;
  publication: {
    id: UUID;
    vehicle: Omit<Vehicle, 'owner'>;
  };
}
