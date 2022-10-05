import { inject, injectable } from 'inversify';

import { AuthUser } from 'apps/auth/domain/auth-user';
import { AuthUserDBRepository } from 'apps/auth/domain/auth-user-db-repository';
import { TYPES } from 'apps/core/container/injection-types';
import { UUID } from 'apps/core/domain/uuid';

@injectable()
export class GetAuthUserById {
  constructor(@inject(TYPES.AuthUserDBRepository) private readonly authUserDBRepository: AuthUserDBRepository) {}

  async execute(id: UUID): Promise<AuthUser> {
    return this.authUserDBRepository.findById(id);
  }
}
