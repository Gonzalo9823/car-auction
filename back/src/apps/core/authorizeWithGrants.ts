import { CheckGrantByRoleId } from 'apps/core/application/check-grant-by-role-id';
import { container } from 'apps/core/container';
import { TYPES } from 'apps/core/container/injection-types';
import { AvailableGrant } from 'apps/core/domain/grant';
import { DecodedTokenData } from 'apps/core/domain/token';
import { User } from 'apps/core/domain/user';
import { GetMeById } from 'apps/me/application/get-me-by-id';

export const authorizeWithGrants = async (user: DecodedTokenData, requiredGrant: AvailableGrant): Promise<User> => {
  const { id, roleId } = user;

  const checkGrantByRoleId = container.get<CheckGrantByRoleId>(TYPES.CheckGrantByRoleId);
  await checkGrantByRoleId.execute(roleId, requiredGrant);

  const getMeById = container.get<GetMeById>(TYPES.GetMeById);
  const { name, phone, email } = await getMeById.execute(id);

  return {
    id,
    name,
    phone,
    email,
  };
};
