import { FastifyPlugin } from 'fastify';

import { DecodedTokenData } from 'apps/core/domain/token';

declare module 'fastify' {
  interface FastifyRequest {
    user: DecodedTokenData;
  }

  interface FastifyInstance {
    needsRefreshToken: () => void;
    needsAccessToken: () => void;
  }
}
