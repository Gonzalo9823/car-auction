import type { JSONSchemaType } from 'ajv';
import { RouteShorthandOptions } from 'fastify';

import { UUID } from 'apps/core/domain/uuid';
import { Publication } from 'apps/publication/domain/publication';

import { createYupSchema } from 'interfaces/fastify/yup-schema';

const publicationSchema: JSONSchemaType<Publication> = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    user: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        phone: { type: 'string' },
        email: { type: 'string' },
      },
      required: ['id', 'name', 'phone', 'email'],
    },
    vehicle: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        licensePlate: { type: 'string' },
        brand: { type: 'string' },
        model: { type: 'string' },
        year: { type: 'number' },
        kilometers: { type: 'number' },
      },
      required: ['id', 'licensePlate', 'brand', 'model', 'year', 'kilometers'],
    },
    bids: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          bidder: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              phone: { type: 'string' },
              email: { type: 'string' },
            },
            required: ['id', 'name', 'phone', 'email'],
          },
          biddedAt: { type: 'string' },
          amount: { type: 'number' },
        },
        required: ['id', 'bidder', 'biddedAt', 'amount'],
      },
    },
    winner: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        phone: { type: 'string' },
        email: { type: 'string' },
      },
      required: ['id', 'name', 'phone', 'email'],
      nullable: true,
    },
    endDate: { type: 'string' },
  },
  required: ['id', 'user', 'vehicle', 'bids', 'endDate'],
};

// POST / opt
export const publicationsPostOpt: RouteShorthandOptions = {
  schema: createYupSchema((yup) => ({
    tags: ['Publications'],
    description: 'Route to create a new Publication.',
    body: yup
      .object({
        vehicleId: yup.string().uuid().required(),
        endDate: yup.date().required(),
      })
      .required(),
    response: {
      200: {
        type: 'object',
        properties: {
          publication: publicationSchema,
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

export interface PublicationsPostRequest {
  Body: {
    vehicleId: string;
    endDate: Date;
  };
  Params: {};
  Reply: {
    publication: Publication;
  };
}

// GET / opt
export const publicationsGetOpt: RouteShorthandOptions = {
  schema: createYupSchema(() => ({
    tags: ['Publications'],
    description: 'Route to get all the active publications.',
    response: {
      200: {
        type: 'object',
        properties: {
          publications: {
            type: 'array',
            items: publicationSchema,
          },
        },
      },
    },
  })),
};

export interface PublicationsGetRequest {
  Body: {};
  Params: {};
  Reply: {
    publications: Publication[];
  };
}

// GET /:publicationId opt
export const publicationGetOpt: RouteShorthandOptions = {
  schema: createYupSchema((yup) => ({
    tags: ['Publications'],
    description: 'Route to get a publication.',
    params: yup
      .object({
        publicationId: yup.string().uuid().required(),
      })
      .required(),
    response: {
      200: {
        type: 'object',
        properties: {
          publication: publicationSchema,
        },
      },
    },
  })),
};

export interface PublicationGetRequest {
  Body: {};
  Params: {
    publicationId: UUID;
  };
  Reply: {
    publication: Publication;
  };
}

// GET /mine opt
export const publicationsMineGetOpt: RouteShorthandOptions = {
  schema: createYupSchema(() => ({
    tags: ['Publications'],
    description: 'Route to get my publications.',
    response: {
      200: {
        type: 'object',
        properties: {
          publications: {
            type: 'array',
            items: publicationSchema,
          },
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

export interface PublicationsMineGetRequest {
  Body: {};
  Params: {};
  Reply: {
    publications: Publication[];
  };
}

// GET /bidded opt
export const publicationsBiddedGetOpt: RouteShorthandOptions = {
  schema: createYupSchema(() => ({
    tags: ['Publications'],
    description: 'Route to get all publications where I have bidded.',
    response: {
      200: {
        type: 'object',
        properties: {
          publications: {
            type: 'array',
            items: publicationSchema,
          },
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

export interface PublicationsBiddedGetRequest {
  Body: {};
  Params: {};
  Reply: {
    publications: Publication[];
  };
}
