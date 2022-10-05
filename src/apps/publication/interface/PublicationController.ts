import { FastifyPluginAsync } from 'fastify';

import { authorizeWithGrants } from 'apps/core/authorizeWithGrants';
import { container } from 'apps/core/container';
import { TYPES } from 'apps/core/container/injection-types';
import { AvailableGrant } from 'apps/core/domain/grant';
import { needsAccessToken } from 'apps/core/util/token';
import { CreatePublication } from 'apps/publication/application/create-publication';
import { GetBiddedPublications } from 'apps/publication/application/get-bidded-publications';
import { GetMyPublications } from 'apps/publication/application/get-my-publications';
import { GetPublicationById } from 'apps/publication/application/get-publication-by-id';
import { GetPublications } from 'apps/publication/application/get-publications';
import {
  publicationGetOpt,
  PublicationGetRequest,
  publicationsBiddedGetOpt,
  PublicationsBiddedGetRequest,
  publicationsGetOpt,
  PublicationsGetRequest,
  publicationsMineGetOpt,
  PublicationsMineGetRequest,
  publicationsPostOpt,
  PublicationsPostRequest,
} from 'apps/publication/interface/Schema';

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

  fastify.get<PublicationGetRequest>('/:publicationId', publicationGetOpt, async (request, reply) => {
    const { publicationId } = request.params;
    await authorizeWithGrants(request.user, AvailableGrant.ReadPublication);

    const getPublicationById = container.get<GetPublicationById>(TYPES.GetPublicationById);
    const publication = await getPublicationById.execute(publicationId);

    return reply.send({
      publication,
    });
  });

  fastify.get<PublicationsMineGetRequest>('/mine', publicationsMineGetOpt, async (request, reply) => {
    const requestUser = await authorizeWithGrants(request.user, AvailableGrant.CreatePublication);

    const getMyPublications = container.get<GetMyPublications>(TYPES.GetMyPublications);
    const publications = await getMyPublications.execute(requestUser);

    return reply.send({
      publications,
    });
  });

  fastify.get<PublicationsBiddedGetRequest>('/bidded', publicationsBiddedGetOpt, async (request, reply) => {
    const requestUser = await authorizeWithGrants(request.user, AvailableGrant.ViewPublication);

    const getBiddedPublications = container.get<GetBiddedPublications>(TYPES.GetBiddedPublications);
    const publications = await getBiddedPublications.execute(requestUser);

    return reply.send({
      publications,
    });
  });
};
