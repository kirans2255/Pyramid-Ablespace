import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';

let cachedServer: any;

export default async function handler(req: any, res: any) {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (!cachedServer) {
      const app = await NestFactory.create(AppModule, { logger: ['error', 'warn'] });
      app.enableCors({
        origin: true,
        credentials: true,
      });
      app.setGlobalPrefix('api');
      app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
      await app.init();
      cachedServer = app.getHttpAdapter().getInstance();
    }
    return cachedServer(req, res);
  } catch (err: any) {
    console.error('NestJS serverless handler error:', err);
    return res.status(500).json({ error: 'Server initialization error', message: err?.message || 'Internal Server Error' });
  }
}
