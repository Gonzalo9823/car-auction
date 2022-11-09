import { DataSource } from 'typeorm';

import config from '@/config';

const isProduction = config.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: config.DATABASE_URL,
  synchronize: false,
  logging: isProduction ? ['error'] : false,
  extra: {
    max: 15,
  },
  entities: isProduction ? ['build/src/infrastructure/typeorm/entities/**/*.js'] : ['src/infrastructure/typeorm/entities/**/*.ts'],
  migrations: isProduction ? ['build/src/infrastructure/typeorm/migrations/**/*.js'] : ['src/infrastructure/typeorm/migrations/**/*.ts'],
  subscribers: isProduction ? ['build/src/infrastructure/typeorm/subscribers/**/*.js'] : ['src/infrastructure/typeorm/subscribers/**/*.ts'],
});
