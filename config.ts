import 'dotenv/config';

const config = {
  NODE_ENV: process.env.NODE_ENV as 'production' | 'development',
  PORT: (process.env.PORT || 4000) as number,
  DATABASE_URL: process.env.DATABASE_URL,
};

export default config;
