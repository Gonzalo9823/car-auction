import type { JSONSchemaType } from 'ajv';
import { RouteShorthandOptions } from 'fastify';

import { UUID } from 'apps/core/domain/uuid';
import { Vehicle } from 'apps/vehicle/domain/vehicle';

import { createYupSchema } from 'interfaces/fastify/yup-schema';

const vehicleSchema: JSONSchemaType<Omit<Vehicle, 'owner'>> = {
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
};

const vehicleWithOwnerSchema: JSONSchemaType<Vehicle> = {
  type: vehicleSchema.type,
  properties: {
    ...vehicleSchema.properties!,
    owner: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
      },
      required: ['id', 'name'],
    },
  },
  required: [...vehicleSchema.required, 'owner'],
};

// POST / opt
export const vehiclesPostOpt: RouteShorthandOptions = {
  schema: createYupSchema((yup) => ({
    tags: ['Vehicles'],
    description: 'Route to create a new Vehicle.',
    body: yup
      .object({
        licensePlate: yup.string().required(),
        brand: yup.string().required(),
        model: yup.string().required(),
        year: yup.number().min(1).integer().required(),
        kilometers: yup.number().min(1).integer().required(),
      })
      .required(),
    response: {
      200: {
        type: 'object',
        properties: {
          vehicle: vehicleSchema,
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

export interface VehiclesPostRequest {
  Body: {
    licensePlate: string;
    brand: string;
    model: string;
    year: number;
    kilometers: number;
  };
  Params: {};
  Reply: {
    vehicle: Omit<Vehicle, 'owner'>;
  };
}

// GET / opt
export const vehiclesGetOpt: RouteShorthandOptions = {
  schema: createYupSchema(() => ({
    tags: ['Vehicles'],
    description: 'Route to get all the available vehicles.',
    response: {
      200: {
        type: 'object',
        properties: {
          vehicles: {
            type: 'array',
            items: vehicleWithOwnerSchema,
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

export interface VehiclesGetRequest {
  Body: {};
  Params: {};
  Reply: {
    vehicles: Vehicle[];
  };
}

// GET /:vehicleId opt
export const vehicleGetOpt: RouteShorthandOptions = {
  schema: createYupSchema((yup) => ({
    tags: ['Vehicles'],
    description: 'Route to get a vehicle.',
    params: yup
      .object({
        vehicleId: yup.string().uuid().required(),
      })
      .required(),
    response: {
      200: {
        type: 'object',
        properties: {
          vehicle: vehicleWithOwnerSchema,
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

export interface VehicleGetRequest {
  Body: {};
  Params: {
    vehicleId: UUID;
  };
  Reply: {
    vehicle: Vehicle;
  };
}
