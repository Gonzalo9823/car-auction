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

const vehicleWithSoldSchema: JSONSchemaType<Omit<Vehicle, 'owner'> & { sold: boolean }> = {
  type: vehicleSchema.type,
  properties: {
    ...vehicleSchema.properties!,
    sold: { type: 'boolean' },
  },
  required: [...vehicleSchema.required, 'sold'],
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

// POST /:vehicleId/favorite opt
export const vehicleFavoritePostOpt: RouteShorthandOptions = {
  schema: createYupSchema((yup) => ({
    tags: ['Vehicles'],
    description: 'Route to add a vehicle to favorites.',
    params: yup
      .object({
        vehicleId: yup.string().uuid().required(),
      })
      .required(),
    response: {
      200: {},
    },
    security: [
      {
        accessToken: [],
      },
    ],
  })),
};

export interface VehicleFavoritePostRequest {
  Body: {};
  Params: {
    vehicleId: UUID;
  };
  Reply: {};
}

// GET /mine opt
export const vehiclesMineGetOpt: RouteShorthandOptions = {
  schema: createYupSchema(() => ({
    tags: ['Vehicles'],
    description: 'Route to get all my vehicles.',
    response: {
      200: {
        type: 'object',
        properties: {
          vehicles: {
            type: 'array',
            items: vehicleWithSoldSchema,
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

export interface VehiclesMineGetRequest {
  Body: {};
  Params: {};
  Reply: {
    vehicles: (Omit<Vehicle, 'owner'> & { sold: boolean })[];
  };
}

// GET /favorites opt
export const vehiclesFavoritesGetOpt: RouteShorthandOptions = {
  schema: createYupSchema(() => ({
    tags: ['Vehicles'],
    description: 'Route to get all the favorites vehicles.',
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

export interface VehiclesFavoritesGetRequest {
  Body: {};
  Params: {};
  Reply: {
    vehicles: Vehicle[];
  };
}
