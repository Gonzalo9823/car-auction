import { FastifyPluginAsync } from 'fastify';

import { CreateBid } from 'apps/bid/application/create-bid';
import { GetMyBids } from 'apps/bid/application/get-my-bids';
import { bidsMineGetOpt, BidsMineGetRequest, bidsPostOpt, BidsPostRequest } from 'apps/bid/interface/Schema';
import { authorizeWithGrants } from 'apps/core/authorizeWithGrants';
import { container } from 'apps/core/container';
import { TYPES } from 'apps/core/container/injection-types';
import { AvailableGrant } from 'apps/core/domain/grant';
import { needsAccessToken } from 'apps/core/util/token';

export const BidController: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.addHook('onRequest', async (request) => {
    const { authorization } = request.headers;
    request.user = needsAccessToken(authorization);
  });

  fastify.post<BidsPostRequest>('/', bidsPostOpt, async (request, reply) => {
    const { publicationId, amount } = request.body;
    const requestUser = await authorizeWithGrants(request.user, AvailableGrant.CreateBid);

    const createBid = container.get<CreateBid>(TYPES.CreateBid);
    const bid = await createBid.execute(requestUser, publicationId, amount);

    return reply.send({
      bid,
    });
  });

  fastify.get<BidsMineGetRequest>('/', bidsMineGetOpt, async (request, reply) => {
    const requestUser = await authorizeWithGrants(request.user, AvailableGrant.ViewBid);

    const getMyBids = container.get<GetMyBids>(TYPES.GetMyBids);
    const bids = await getMyBids.execute(requestUser);

    return reply.send({
      bids,
    });
  });
};
