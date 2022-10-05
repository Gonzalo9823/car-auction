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
  CreateVehicle = 'CREATE_VEHICLE',
  ViewVehicle = 'VIEW_VEHICLE',
  ReadVehicle = 'READ_VEHICLE',

  // Publication
  CreatePublication = 'CREATE_PUBLICATION',
  ViewPublication = 'VIEW_PUBLICATION',
  ReadPublication = 'READ_PUBLICATION',
}
