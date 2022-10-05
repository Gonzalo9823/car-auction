import { FastifyPluginAsync } from 'fastify';

import { authorizeWithGrants } from 'apps/core/authorizeWithGrants';
import { container } from 'apps/core/container';
import { TYPES } from 'apps/core/container/injection-types';
import { AvailableGrant } from 'apps/core/domain/grant';
import { needsAccessToken } from 'apps/core/util/token';
import { CreateVehicle } from 'apps/vehicle/application/create-vehicle';
import { vehiclesPostOpt, VehiclesPostRequest } from 'apps/vehicle/interface/Schema';

export const VehicleController: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.addHook('onRequest', async (request) => {
    const { authorization } = request.headers;
    request.user = needsAccessToken(authorization);
  });

  fastify.post<VehiclesPostRequest>('/', vehiclesPostOpt, async (request, reply) => {
    const requestUser = await authorizeWithGrants(request.user, AvailableGrant.CreateVehicle);

    const createVehicle = container.get<CreateVehicle>(TYPES.CreateVehicle);
    const vehicle = await createVehicle.execute(requestUser, request.body);

    reply.send({
      vehicle,
    });
  });
};