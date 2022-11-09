import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import createHttpError, { HttpError } from 'http-errors';
import { ValidationError } from 'yup';

import { ContextErrorType, CustomError, ErrorType } from 'apps/core/CustomError';

export const ErrorHandler = async (error: FastifyError, _request: FastifyRequest, reply: FastifyReply) => {
  console.error(error);

  let replyError: HttpError = new createHttpError.InternalServerError();
  let context: { path?: string; type?: ContextErrorType | string }[] = [];

  if (error instanceof CustomError) {
    context = error.context;

    switch (error.type) {
      case ErrorType.NotFound:
        replyError = new createHttpError.NotFound(error.message);
        break;

      case ErrorType.BadRequest:
        replyError = new createHttpError.BadRequest(error.message);
        break;

      case ErrorType.MethodNotAllowed:
        replyError = new createHttpError.MethodNotAllowed(error.message);
        break;

      case ErrorType.Validation:
        replyError = new createHttpError.BadRequest(error.message);
        break;

      case ErrorType.InternalServerError:
        replyError = new createHttpError.InternalServerError(error.message);
        break;

      case ErrorType.Unauthorized:
        replyError = new createHttpError.Unauthorized(error.message);
        break;
    }
  }

  if (error instanceof ValidationError) {
    context.push(
      ...error.inner.map(({ path, type }) => ({
        path,
        type,
      }))
    );

    replyError = new createHttpError.BadRequest();
    replyError.message = 'INVALID_DATA';
  }

  reply.code(replyError.statusCode).send({
    error: replyError.name,
    message: replyError.message,
    context,
  });
};
