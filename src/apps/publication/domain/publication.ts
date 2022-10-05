import { Bid } from 'apps/bid/domain/bid';
import { User } from 'apps/core/domain/user';
import { UUID } from 'apps/core/domain/uuid';
import { Vehicle } from 'apps/vehicle/domain/vehicle';

export interface Publication {
  id: UUID;
  user: User;
  vehicle: Omit<Vehicle, 'owner'>;
  bids: Omit<Bid, 'publication'>[];
  winner?: User;
  endDate: Date;
}
