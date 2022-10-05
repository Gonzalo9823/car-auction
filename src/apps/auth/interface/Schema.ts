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
