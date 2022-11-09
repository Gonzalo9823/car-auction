import { FastifyPluginAsync } from 'fastify';

export const IndexController: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('', { schema: { tags: ['Health'], description: 'Health route to know if the api is running.' } }, async (_, reply) => {
    reply.send('Hello World V1!');
  });
};
