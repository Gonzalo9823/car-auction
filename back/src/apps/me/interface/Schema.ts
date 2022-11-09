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

// PATCH / opt
export const mePatchOpt: RouteShorthandOptions = {
  schema: createYupSchema((yup) => ({
    tags: ['Me'],
    description: 'Route to update my data.',
    body: yup
      .object({
        name: yup.string().required(),
        phone: yup.string().required(),
        email: yup.string().email().required(),
      })
      .required(),
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

export interface MePatchRequest {
  Body: {
    name: string;
    phone: string;
    email: string;
  };
  Params: {};
  Reply: {
    me: Me;
  };
}

// PATCH /password opt
export const mePasswordPatchOpt: RouteShorthandOptions = {
  schema: createYupSchema((yup) => ({
    tags: ['Me'],
    description: 'Route to update my password.',
    body: yup
      .object({
        password: yup.string().required(),
        newPassword: yup.string().required(),
      })
      .required(),
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

export interface MePasswordPatchRequest {
  Body: {
    password: string;
    newPassword: string;
  };
  Params: {};
  Reply: {
    me: Me;
  };
}
