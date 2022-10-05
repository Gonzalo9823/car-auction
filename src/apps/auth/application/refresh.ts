import { inject, injectable } from 'inversify';

import { AddRefreshToken } from 'apps/auth/application/add-refresh-token';
import { CheckRefreshToken } from 'apps/auth/application/check-refresh-token';
import { RemoveRefreshToken } from 'apps/auth/application/remove-refresh-token';
import { AuthUserDBRepository } from 'apps/auth/domain/auth-user-db-repository';
import { TYPES } from 'apps/core/container/injection-types';
import { RefreshToken } from 'apps/core/domain/token';
import { UUID } from 'apps/core/domain/uuid';

@injectable()
export class Refresh {
  constructor(
    @inject(TYPES.AuthUserDBRepository) private readonly authUserDBRepository: AuthUserDBRepository,
    @inject(TYPES.CheckRefreshToken) private readonly checkRefreshToken: CheckRefreshToken,
    @inject(TYPES.AddRefreshToken) private readonly addRefreshToken: AddRefreshToken,
    @inject(TYPES.RemoveRefreshToken) private readonly removeRefreshToken: RemoveRefreshToken
  ) {}

  async execute(id: UUID, token: RefreshToken): Promise<{ refreshToken: string; accessToken: string }> {
    const authUser = await this.authUserDBRepository.findById(id);

    await this.checkRefreshToken.execute(authUser, token);
    await this.removeRefreshToken.execute(authUser, token);
    const { refreshToken, accessToken } = await this.addRefreshToken.execute(authUser);

    return {
      refreshToken,
      accessToken,
    };
  }
}
