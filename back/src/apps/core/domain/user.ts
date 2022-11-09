import { UUID } from 'apps/core/domain/uuid';

export interface User {
  id: UUID;
  name: string;
  phone: string;
  email: string;
}
