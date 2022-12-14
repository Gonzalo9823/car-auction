import 'dotenv/config';

const config = {
  NODE_ENV: process.env.NODE_ENV as 'production' | 'development',
  PORT: (process.env.PORT || 4000) as number,
  DATABASE_URL: process.env.DATABASE_URL,
  OPENSEARCH_URL: process.env.OPENSEARCH_URL,
  PASSWORD_SALT: process.env.PASSWORD_SALT || 'PASSWORD_SALT',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'REFRESH_TOKEN_SECRET',
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'ACCESS_TOKEN_SECRET',
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'COOKIE_SECRET',
  IS_RUNNING_ON_KUBERNETES: process.env.IS_RUNNING_ON_KUBERNETES || false,
};

export default config;
