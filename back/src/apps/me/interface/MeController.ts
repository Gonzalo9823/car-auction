import { FastifyPluginAsync } from 'fastify';

import { authorizeWithGrants } from 'apps/core/authorizeWithGrants';
import { container } from 'apps/core/container';
import { TYPES } from 'apps/core/container/injection-types';
import { AvailableGrant } from 'apps/core/domain/grant';
import { needsAccessToken } from 'apps/core/util/token';
import { GetMeById } from 'apps/me/application/get-me-by-id';
import { UpdateMyData } from 'apps/me/application/update-my-data';
import { UpdateMyPassword } from 'apps/me/application/update-my-password';
import { meGetOpt, MeGetRequest, mePasswordPatchOpt, MePasswordPatchRequest, mePatchOpt, MePatchRequest } from 'apps/me/interface/Schema';

export const MeController: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.addHook('onRequest', async (request) => {
    const { authorization } = request.headers;
    request.user = needsAccessToken(authorization);
  });

  fastify.get<MeGetRequest>('/', meGetOpt, async (request, reply) => {
    const requestUser = await authorizeWithGrants(request.user, AvailableGrant.ReadMe);

    const getMeById = container.get<GetMeById>(TYPES.GetMeById);
    const me = await getMeById.execute(requestUser.id);

    return reply.send({
      me,
    });
  });

  fastify.patch<MePatchRequest>('/', mePatchOpt, async (request, reply) => {
    const requestUser = await authorizeWithGrants(request.user, AvailableGrant.UpdateMe);

    const updateMyData = container.get<UpdateMyData>(TYPES.UpdateMyData);
    const me = await updateMyData.execute(requestUser.id, request.body);

    return reply.send({
      me,
    });
  });

  fastify.patch<MePasswordPatchRequest>('/password', mePasswordPatchOpt, async (request, reply) => {
    const { password, newPassword } = request.body;
    const requestUser = await authorizeWithGrants(request.user, AvailableGrant.UpdateMe);

    const updateMyPassword = container.get<UpdateMyPassword>(TYPES.UpdateMyPassword);
    const me = await updateMyPassword.execute(requestUser.id, password, newPassword);

    return reply.send({
      me,
    });
  });
};
