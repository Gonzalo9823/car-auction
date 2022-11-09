import { Bid } from './Bid';
import { User } from './User';
import { Vehicle } from './Vehicle';

export interface Publication {
  id: string;
  user: User;
  vehicle: Vehicle;
  bids: Bid[];
  winner?: User;
  endDate: string;
}
