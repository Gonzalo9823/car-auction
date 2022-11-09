import { inject, injectable } from 'inversify';

import { GetAuthUserById } from 'apps/auth/application/get-auth-user-by-id';
import { TYPES } from 'apps/core/container/injection-types';
import { UUID } from 'apps/core/domain/uuid';
import { checkPassword, encryptPassword } from 'apps/core/util/password';
import { Me } from 'apps/me/domain/me';
import { MeDBRepository } from 'apps/me/domain/me-db-repository';

@injectable()
export class UpdateMyPassword {
  constructor(
    @inject(TYPES.MeDBRepository) private readonly meDBRepository: MeDBRepository,
    @inject(TYPES.GetAuthUserById) private readonly getAuthUserById: GetAuthUserById
  ) {}

  async execute(id: UUID, password: string, newPassword: string): Promise<Me> {
    const authUser = await this.getAuthUserById.execute(id);

    await checkPassword(password, authUser.encryptedPassword, true);
    const encryptedPassword = await encryptPassword(newPassword);

    return this.meDBRepository.updatePassword(id, encryptedPassword);
  }
}
