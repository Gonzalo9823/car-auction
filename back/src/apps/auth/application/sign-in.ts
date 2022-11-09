import { inject, injectable } from 'inversify';

import { AddRefreshToken } from 'apps/auth/application/add-refresh-token';
import { AuthUserDBRepository } from 'apps/auth/domain/auth-user-db-repository';
import { TYPES } from 'apps/core/container/injection-types';
import { CustomError, ErrorCode, ErrorType } from 'apps/core/CustomError';
import { checkPassword } from 'apps/core/util/password';

@injectable()
export class SignIn {
  constructor(
    @inject(TYPES.AuthUserDBRepository) private readonly authUserDBRepository: AuthUserDBRepository,
    @inject(TYPES.AddRefreshToken) private readonly addRefreshToken: AddRefreshToken
  ) {}

  async execute(email: string, password: string): Promise<{ refreshToken: string; accessToken: string }> {
    try {
      const authUser = await this.authUserDBRepository.findByEmail(email);
      await checkPassword(password, authUser.encryptedPassword);

      const { refreshToken, accessToken } = await this.addRefreshToken.execute(authUser);

      return {
        refreshToken,
        accessToken,
      };
    } catch (err) {
      if (err instanceof CustomError && err.message !== ErrorCode.DataNotFound) {
        throw err;
      }

      throw new CustomError(ErrorType.NotFound, ErrorCode.EmailOrPasswordIncorrect);
    }
  }
}
