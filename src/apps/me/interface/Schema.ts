import type { JSONSchemaType } from 'ajv';
import { RouteShorthandOptions } from 'fastify';

import { Me } from 'apps/me/domain/me';

import { createYupSchema } from 'interfaces/fastify/yup-schema';

const meSchema: JSONSchemaType<Me> = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    name: { type: 'string' },
    phone: { type: 'string' },
    email: { type: 'string' },
  },
  required: ['id', 'name', 'phone', 'email'],
};

// GET / opt
export const meGetOpt: RouteShorthandOptions = {
  schema: createYupSchema(() => ({
    tags: ['Me'],
    description: 'Route to view my data.',
    response: {
      200: {
        type: 'object',
        properties: {
          me: meSchema,
        },
      },
    },
    security: [
      {
        accessToken: [],
      },
    ],
  })),
};

export interface MeGetRequest {
  Body: {};
  Params: {};
  Reply: {
    me: Me;
  };
}
