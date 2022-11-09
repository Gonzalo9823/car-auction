import { User } from './User';

export interface Bid {
  id: string;
  bidder: User;
  biddetAt: string;
  amount: number;
}
