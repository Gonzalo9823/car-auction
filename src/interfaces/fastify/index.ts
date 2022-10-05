import 'reflect-metadata';

import { AppDataSource } from 'infrastructure/typeorm';

import { app } from 'interfaces/fastify/app';

import config from '@/config';

const start = async () => {
  try {
    await AppDataSource.initialize();
    await app.listen({ port: config.PORT, host: '0.0.0.0' });
    console.log(`🚀 App Running on PORT ${config.PORT}`);
  } catch (err) {
    console.log(`There was an error ${err}`);
    process.exit(1);
  }
};

start();
