import { UUID } from 'apps/core/domain/uuid';

export interface Vehicle {
  id: UUID;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  kilometers: number;
  owner: {
    id: UUID;
    name: string;
  };
}
