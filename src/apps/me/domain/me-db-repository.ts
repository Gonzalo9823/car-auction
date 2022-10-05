import { UUID } from 'apps/core/domain/uuid';
import { Me } from 'apps/me/domain/me';

export interface MeDBRepository {
  findMyData(id: UUID): Promise<Me>;
}
