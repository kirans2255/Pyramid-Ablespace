import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

async function bootstrap() {
  const defaultUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pyramid_task_db';
  
  try {
    const conn = await mongoose.connect(defaultUri, { serverSelectionTimeoutMS: 2000 });
    await conn.disconnect();
    console.log('Connected to local MongoDB instance:', defaultUri);
  } catch (err) {
    console.log('Local MongoDB not found. Starting MongoMemoryServer fallback...');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    (global as any).__MONGO_URI__ = uri;
    console.log('MongoMemoryServer running at:', uri);
  }

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`NestJS Backend Server listening on http://localhost:${port}/api`);
}

bootstrap();
