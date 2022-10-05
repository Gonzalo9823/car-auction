import { FastifyPluginAsync } from 'fastify';

import { authorizeWithGrants } from 'apps/core/authorizeWithGrants';
import { container } from 'apps/core/container';
import { TYPES } from 'apps/core/container/injection-types';
import { AvailableGrant } from 'apps/core/domain/grant';
import { needsAccessToken } from 'apps/core/util/token';
import { CreatePublication } from 'apps/publication/application/create-publication';
import { GetPublications } from 'apps/publication/application/get-publications';
import { publicationsGetOpt, PublicationsGetRequest, publicationsPostOpt, PublicationsPostRequest } from 'apps/publication/interface/Schema';

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

  fastify.get<PublicationsGetRequest>('/', publicationsGetOpt, async (request, reply) => {
    await authorizeWithGrants(request.user, AvailableGrant.ViewPublication);

    const getPublications = container.get<GetPublications>(TYPES.GetPublications);
    const publications = await getPublications.execute();

    return reply.send({
      publications,
    });
  });
};
