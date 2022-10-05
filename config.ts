import 'dotenv/config';

const config = {
  NODE_ENV: process.env.NODE_ENV as 'production' | 'development',
  PORT: (process.env.PORT || 4000) as number,
  DATABASE_URL: process.env.DATABASE_URL,
  PASSWORD_SALT: process.env.PASSWORD_SALT || 'PASSWORD_SALT',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'REFRESH_TOKEN_SECRET',
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'ACCESS_TOKEN_SECRET',
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'COOKIE_SECRET',
};

export default config;
