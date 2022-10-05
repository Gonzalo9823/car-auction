import { FastifyPluginAsync } from 'fastify';

import { SignUp } from 'apps/auth/application/sign-up';
import { authSignUpPostOpt, AuthSignUpPostRequest } from 'apps/auth/interface/Schema';
import { container } from 'apps/core/container';
import { TYPES } from 'apps/core/container/injection-types';

export const AuthController: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post<AuthSignUpPostRequest>('/sign-up', authSignUpPostOpt, async (request, reply) => {
    const signUp = container.get<SignUp>(TYPES.SignUp);

    await signUp.execute(request.body);

    return reply.send({});
  });
};
