import { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { IndexController } from 'interfaces/fastify/controllers/IndexController';

const _routes: [string, FastifyPluginAsync][] = [['/', IndexController]];

export const routes = (app: FastifyInstance): void => {
  _routes.forEach((route) => {
    const [url, controller] = route;
    app.register(controller, {
      prefix: `/v1${url}`,
    });
  });
};
