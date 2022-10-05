import { UUID } from 'apps/core/domain/uuid';

export interface Role {
  id: UUID;
  name: AvailableRole;
}

export enum AvailableRole {
  User = 'USER',
}
