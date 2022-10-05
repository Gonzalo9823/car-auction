import { inject, injectable } from 'inversify';

import { AuthUser } from 'apps/auth/domain/auth-user';
import { AuthUserDBRepository } from 'apps/auth/domain/auth-user-db-repository';
import { generateAccessToken, generateRefreshToken } from 'apps/auth/util/token';
import { TYPES } from 'apps/core/container/injection-types';

@injectable()
export class AddRefreshToken {
  constructor(@inject(TYPES.AuthUserDBRepository) private readonly authUserDBRepository: AuthUserDBRepository) {}

  async execute(user: AuthUser): Promise<{ refreshToken: string; accessToken: string }> {
    const refreshToken = generateRefreshToken(user);
    const accessToken = generateAccessToken(user);

    await this.authUserDBRepository.addRefreshToken(user.id, refreshToken);

    return {
      refreshToken,
      accessToken,
    };
  }
}
