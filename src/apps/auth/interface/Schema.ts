import { RouteShorthandOptions } from 'fastify';

import { createYupSchema } from 'interfaces/fastify/yup-schema';

// Post /auth/sign-up opt
export const authSignUpPostOpt: RouteShorthandOptions = {
  schema: createYupSchema((yup) => ({
    tags: ['Auth'],
    description: 'Route to register on the plataform.',
    body: yup
      .object({
        name: yup.string().required(),
        phone: yup.string().required(),
        email: yup.string().required(),
        password: yup.string().required(),
      })
      .required(),
    response: {
      200: {},
    },
  })),
};

export interface AuthSignUpPostRequest {
  Body: {
    name: string;
    phone: string;
    email: string;
    password: string;
  };
  Reply: {};
}

// POST /auth/sign-in opt
export const authSignInPostOpt: RouteShorthandOptions = {
  schema: createYupSchema((yup) => ({
    tags: ['Auth'],
    description: 'Route to sign in on the plataform.',
    body: yup
      .object({
        email: yup.string().email().required(),
        password: yup.string().required(),
      })
      .required(),
    response: {
      200: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
        },
        headers: {
          r_token: {
            type: 'string',
            description: 'Refresh Token',
          },
        },
        required: ['accessToken'],
      },
    },
  })),
};

export interface AuthSignInPostRequest {
  Body: {
    email: string;
    password: string;
  };
  Reply: {
    accessToken: string;
  };
}

// POST /refresh opt
export const refreshPostOpt: RouteShorthandOptions = {
  schema: createYupSchema(() => ({
    tags: ['Auth'],
    description: 'Route to ask for a new Refresh Token',
    response: {
      200: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
        },
        headers: {
          r_token: {
            type: 'string',
            description: 'Refresh Token',
          },
        },
        required: ['accessToken'],
      },
    },
    security: [
      {
        refreshToken: [],
      },
    ],
  })),
};

export interface AuthRefreshPostRequest {
  Body: {};
  Reply: {
    accessToken: string;
  };
}
