import { inject, injectable } from 'inversify';

import { AuthUser } from 'apps/auth/domain/auth-user';
import { AuthUserDBRepository } from 'apps/auth/domain/auth-user-db-repository';
import { TYPES } from 'apps/core/container/injection-types';
import { ContextErrorType, CustomError, ErrorCode, ErrorType } from 'apps/core/CustomError';
import { RefreshToken } from 'apps/core/domain/token';

@injectable()
export class CheckRefreshToken {
  constructor(@inject(TYPES.AuthUserDBRepository) private readonly authUserDBRepository: AuthUserDBRepository) {}

  async execute(user: AuthUser, token: RefreshToken): Promise<void> {
    const isValid = await this.authUserDBRepository.isRefreshTokenValid(user.id, token);

    if (!isValid) {
      throw new CustomError(ErrorType.Unauthorized, ErrorCode.InvalidToken, [{ type: ContextErrorType.InvalidData, path: 'CheckRefreshToken' }]);
    }
  }
}
