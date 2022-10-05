import { UUID } from 'apps/core/domain/uuid';

export interface Grant {
  id: UUID;
  name: AvailableGrant;
}

export enum AvailableGrant {
  // Me
  ReadMe = 'READ_ME',
  UpdateMe = 'UPDATE_ME',

  // Vehicle
  CreateVehicle = 'CreateVehicle',
}
