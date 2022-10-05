import { FastifyPluginAsync } from 'fastify';

import { authorizeWithGrants } from 'apps/core/authorizeWithGrants';
import { container } from 'apps/core/container';
import { TYPES } from 'apps/core/container/injection-types';
import { AvailableGrant } from 'apps/core/domain/grant';
import { needsAccessToken } from 'apps/core/util/token';
import { AddVehicleToFavorites } from 'apps/vehicle/application/add-vehicle-to-favorites';
import { CreateVehicle } from 'apps/vehicle/application/create-vehicle';
import { GetMyVehicles } from 'apps/vehicle/application/get-my-vehicles';
import { GetVehicleById } from 'apps/vehicle/application/get-vehicle-by-id';
import { GetVehicles } from 'apps/vehicle/application/get-vehicles';
import {
  vehicleFavoritePostOpt,
  VehicleFavoritePostRequest,
  vehicleGetOpt,
  VehicleGetRequest,
  vehiclesGetOpt,
  VehiclesGetRequest,
  vehiclesMineGetOpt,
  VehiclesMineGetRequest,
  vehiclesPostOpt,
  VehiclesPostRequest,
} from 'apps/vehicle/interface/Schema';

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

  fastify.get<VehiclesGetRequest>('/', vehiclesGetOpt, async (request, reply) => {
    await authorizeWithGrants(request.user, AvailableGrant.ViewVehicle);

    const getVehicles = container.get<GetVehicles>(TYPES.GetVehicles);
    const vehicles = await getVehicles.execute();

    reply.send({
      vehicles,
    });
  });

  fastify.get<VehicleGetRequest>('/:vehicleId', vehicleGetOpt, async (request, reply) => {
    const { vehicleId } = request.params;
    await authorizeWithGrants(request.user, AvailableGrant.ReadVehicle);

    const getVehicleById = container.get<GetVehicleById>(TYPES.GetVehicleById);
    const vehicle = await getVehicleById.execute(vehicleId);

    reply.send({
      vehicle,
    });
  });

  fastify.get<VehicleFavoritePostRequest>('/:vehicleId/favorite', vehicleFavoritePostOpt, async (request, reply) => {
    const { vehicleId } = request.params;
    const requestUser = await authorizeWithGrants(request.user, AvailableGrant.ReadVehicle);

    const addVehicleToFavorites = container.get<AddVehicleToFavorites>(TYPES.AddVehicleToFavorites);
    await addVehicleToFavorites.execute(requestUser, vehicleId);

    reply.send({});
  });

  fastify.get<VehiclesMineGetRequest>('/mine', vehiclesMineGetOpt, async (request, reply) => {
    const requestUser = await authorizeWithGrants(request.user, AvailableGrant.ViewVehicle);

    const getMyVehicles = container.get<GetMyVehicles>(TYPES.GetMyVehicles);
    const vehicles = await getMyVehicles.execute(requestUser);

    reply.send({
      vehicles,
    });
  });
};
