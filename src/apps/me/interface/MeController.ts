import { FastifyPluginAsync } from 'fastify';

import { authorizeWithGrants } from 'apps/core/authorizeWithGrants';
import { container } from 'apps/core/container';
import { TYPES } from 'apps/core/container/injection-types';
import { AvailableGrant } from 'apps/core/domain/grant';
import { needsAccessToken } from 'apps/core/util/token';
import { GetMeById } from 'apps/me/application/get-me-by-id';
import { meGetOpt, MeGetRequest } from 'apps/me/interface/Schema';

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
};
