import { inject, injectable } from 'inversify';

import { AuthUser } from 'apps/auth/domain/auth-user';
import { AuthUserDBRepository } from 'apps/auth/domain/auth-user-db-repository';
import { TYPES } from 'apps/core/container/injection-types';
import { RefreshToken } from 'apps/core/domain/token';

@injectable()
export class RemoveRefreshToken {
  constructor(@inject(TYPES.AuthUserDBRepository) private readonly authUserDBRepository: AuthUserDBRepository) {}

  async execute(user: AuthUser, token: RefreshToken, shouldInvalidate: boolean): Promise<void> {
    return this.authUserDBRepository.removeRefreshToken(user.id, token, shouldInvalidate);
  }
}
