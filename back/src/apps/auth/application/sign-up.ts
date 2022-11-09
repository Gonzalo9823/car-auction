import { inject, injectable } from 'inversify';

import { AuthUserDBRepository, CreateUserDto } from 'apps/auth/domain/auth-user-db-repository';
import { TYPES } from 'apps/core/container/injection-types';
import { encryptPassword } from 'apps/core/util/password';
import { GetRoleByName } from 'apps/role/application/get-role-by-name';
import { AvailableRole } from 'apps/role/domain/role';

@injectable()
export class SignUp {
  constructor(
    @inject(TYPES.AuthUserDBRepository) private readonly authDBRepository: AuthUserDBRepository,
    @inject(TYPES.GetRoleByName) private readonly getRoleByName: GetRoleByName
  ) {}

  async execute(userData: Omit<CreateUserDto, 'role' | 'encryptedPassword'> & { password: string }): Promise<void> {
    const { password, ..._userData } = userData;

    const role = await this.getRoleByName.execute(AvailableRole.User);
    const encryptedPassword = await encryptPassword(password);

    return this.authDBRepository.create({ ..._userData, role, encryptedPassword });
  }
}
