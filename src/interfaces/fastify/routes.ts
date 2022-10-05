import { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { AuthController } from 'apps/auth/interface/AuthController';

import { IndexController } from 'interfaces/fastify/controllers/IndexController';

const _routes: [string, FastifyPluginAsync][] = [
  ['/', IndexController],
  ['/auth', AuthController],
];

export const routes = (app: FastifyInstance): void => {
  _routes.forEach((route) => {
    const [url, controller] = route;
    app.register(controller, {
      prefix: `/v1${url}`,
    });
  });
};
