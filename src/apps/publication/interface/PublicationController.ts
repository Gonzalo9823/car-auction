import { FastifyPluginAsync } from 'fastify';

import { authorizeWithGrants } from 'apps/core/authorizeWithGrants';
import { container } from 'apps/core/container';
import { TYPES } from 'apps/core/container/injection-types';
import { AvailableGrant } from 'apps/core/domain/grant';
import { needsAccessToken } from 'apps/core/util/token';
import { CreatePublication } from 'apps/publication/application/create-publication';
import { publicationsPostOpt, PublicationsPostRequest } from 'apps/publication/interface/Schema';

export const PublicationController: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.addHook('onRequest', async (request) => {
    const { authorization } = request.headers;
    request.user = needsAccessToken(authorization);
  });

  fastify.post<PublicationsPostRequest>('/', publicationsPostOpt, async (request, reply) => {
    const requestUser = await authorizeWithGrants(request.user, AvailableGrant.CreatePublication);

    const createPublication = container.get<CreatePublication>(TYPES.CreatePublication);
    const publication = await createPublication.execute(requestUser, request.body);

    return reply.send({
      publication,
    });
  });
};
