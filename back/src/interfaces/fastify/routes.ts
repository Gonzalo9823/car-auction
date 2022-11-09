import { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { AuthController } from 'apps/auth/interface/AuthController';
import { BidController } from 'apps/bid/interface/BidController';
import { MeController } from 'apps/me/interface/MeController';
import { PublicationController } from 'apps/publication/interface/PublicationController';
import { VehicleController } from 'apps/vehicle/interface/VehicleController';

import { IndexController } from 'interfaces/fastify/controllers/IndexController';

const _routes: [string, FastifyPluginAsync][] = [
  ['/', IndexController],
  ['/auth', AuthController],
  ['/vehicles', VehicleController],
  ['/me', MeController],
  ['/publications', PublicationController],
  ['/bids', BidController],
];

export const routes = (app: FastifyInstance): void => {
  _routes.forEach((route) => {
    const [url, controller] = route;
    app.register(controller, {
      prefix: `/v1${url}`,
    });
  });
};
