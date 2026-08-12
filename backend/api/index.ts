import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let cachedApp: any = null;

async function bootstrapServerless() {
  if (cachedApp) return cachedApp;

  const defaultUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pyramid_task_db';
  try {
    const conn = await mongoose.connect(defaultUri, { serverSelectionTimeoutMS: 2000 });
    await conn.disconnect();
  } catch (err) {
    if (!(global as any).__MONGO_URI__) {
      try {
        const mongod = await MongoMemoryServer.create();
        (global as any).__MONGO_URI__ = mongod.getUri();
      } catch (e) {
        console.error('MongoMemoryServer fallback error:', e);
      }
    }
  }

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.init();

  const expressInstance = app.getHttpAdapter().getInstance();
  cachedApp = expressInstance;
  return expressInstance;
}

export default async function handler(req: any, res: any) {
  const expressApp = await bootstrapServerless();
  return expressApp(req, res);
}
