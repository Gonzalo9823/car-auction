import cookie, { FastifyCookieOptions } from '@fastify/cookie';
import formbody from '@fastify/formbody';
import helmet from '@fastify/helmet';
import fastifySwagger, { JSONObject } from '@fastify/swagger';
import requestLogger from '@mgcrea/fastify-request-logger';
import yupToJsonSchema from '@sodaru/yup-to-json-schema';
import fastify, { FastifyRequest } from 'fastify';
import { AnySchema } from 'yup';

import { needsAccessToken, needsRefreshToken } from 'apps/core/util/token';

import { ErrorHandler } from 'interfaces/fastify/ErrorHandler';
import { routes } from 'interfaces/fastify/routes';
import { fastifyYupSchema } from 'interfaces/fastify/yup-schema';

import config from '@/config';

const app = fastify({
  logger: { transport: { target: '@mgcrea/pino-pretty-compact', options: { colorize: true } } },
  disableRequestLogging: true,
});

// Add Helmet
app.register(helmet, {
  global: true,
  contentSecurityPolicy: {
    directives: {
      scriptSrc: ["'self'", "'sha256-2yQBTLGLI1sDcBILfj/o6b5ufMv6CEwPYOk3RZI/WjE='"],
      styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
    },
  },
});

// Add Logger
app.register(requestLogger);

// Add Form Body Plugin
app.register(formbody);

// Add Error Handler
app.setErrorHandler(ErrorHandler);

// Add Cookie Plugin
app.register(cookie, {
  secret: config.COOKIE_SECRET,
  parseOptions: {},
} as FastifyCookieOptions);

// Add Yup Schema Validator
app.register(fastifyYupSchema);

// Add needsRefreshToken Decorator
app.decorate('needsRefreshToken', async (request: FastifyRequest) => {
  request.user = needsRefreshToken(request.cookies.r_token);
});

// Add needsAccessToken Decorator
app.decorate('needsAccessToken', async (request: FastifyRequest) => {
  request.user = needsAccessToken(request.headers.authorization);
});

// Add Swagger
app.register(fastifySwagger, {
  exposeRoute: true,
  routePrefix: '/docs',
  openapi: {
    info: {
      title: 'Car Auction API',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:4000',
      },
    ],
    components: {
      securitySchemes: {
        accessToken: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        refreshToken: {
          type: 'apiKey',
          in: 'cookie',
          name: 'r_token',
        },
      },
    },
  },
  transform: ({ schema, url }) => {
    const { security, body, params, querystring, response, tags, hide, consumes, description } = { ...schema };

    const transformedSchema: JSONObject = {
      response: response as JSONObject,
      hide: hide || false,
      consumes: consumes || ['application/json'],
      description: description || '',
    };

    if (security) {
      transformedSchema.security = security;
    }

    if (tags) {
      transformedSchema.tags = tags;
    }

    if (body) {
      transformedSchema.body = yupToJsonSchema(schema.body as AnySchema) as JSONObject;
    }

    if (params) {
      transformedSchema.params = yupToJsonSchema(schema.params as AnySchema) as JSONObject;
    }

    if (querystring) {
      transformedSchema.querystring = yupToJsonSchema(schema.querystring as AnySchema) as JSONObject;
    }

    return { schema: transformedSchema, url };
  },
});

// Add Routes
routes(app);

export { app };
