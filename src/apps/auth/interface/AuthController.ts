import { FastifyPluginAsync } from 'fastify';

import { SignIn } from 'apps/auth/application/sign-in';
import { SignUp } from 'apps/auth/application/sign-up';
import { authSignInPostOpt, AuthSignInPostRequest, authSignUpPostOpt, AuthSignUpPostRequest } from 'apps/auth/interface/Schema';
import { container } from 'apps/core/container';
import { TYPES } from 'apps/core/container/injection-types';

import config from '@/config';

export const AuthController: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post<AuthSignUpPostRequest>('/sign-up', authSignUpPostOpt, async (request, reply) => {
    const signUp = container.get<SignUp>(TYPES.SignUp);
    await signUp.execute(request.body);

    return reply.send({});
  });

  fastify.post<AuthSignInPostRequest>('/sign-in', authSignInPostOpt, async (request, reply) => {
    const { email, password } = request.body;

    const signIn = container.get<SignIn>(TYPES.SignIn);
    const { refreshToken, accessToken } = await signIn.execute(email, password);

    reply.setCookie('r_token', refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: true,
      secure: config.NODE_ENV === 'production',
      path: '/',
    });

    reply.send({ accessToken });
  });
};
