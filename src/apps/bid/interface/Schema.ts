import type { JSONSchemaType } from 'ajv';
import { RouteShorthandOptions } from 'fastify';

import { Bid } from 'apps/bid/domain/bid';
import { UUID } from 'apps/core/domain/uuid';

import { createYupSchema } from 'interfaces/fastify/yup-schema';

const bidSchema: JSONSchemaType<Bid> = {
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
    publication: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
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
      },
      required: ['id', 'vehicle'],
    },
  },
  required: ['id', 'bidder', 'biddedAt', 'amount', 'publication'],
};

// POST / opt
export const bidsPostOpt: RouteShorthandOptions = {
  schema: createYupSchema((yup) => ({
    tags: ['Bids'],
    description: 'Route to create a new Bid.',
    body: yup
      .object({
        publicationId: yup.string().uuid().required(),
        amount: yup.number().min(1).integer().required(),
      })
      .required(),
    response: {
      200: {
        type: 'object',
        properties: {
          bid: bidSchema,
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

export interface BidsPostRequest {
  Body: {
    publicationId: UUID;
    amount: number;
  };
  Params: {};
  Reply: {
    bid: Bid;
  };
}
