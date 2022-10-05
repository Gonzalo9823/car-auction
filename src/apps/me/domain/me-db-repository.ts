import { UUID } from 'apps/core/domain/uuid';
import { Me } from 'apps/me/domain/me';

export interface UpdateMeDto {
  name: string;
  phone: string;
  email: string;
}

export interface MeDBRepository {
  findMyData(id: UUID): Promise<Me>;
  update(id: UUID, meData: UpdateMeDto): Promise<Me>;
}
