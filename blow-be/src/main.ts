import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const corsOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const defaultCorsOrigins = [
    'http://localhost:3000',
    'https://kutumba.ru',
    'https://www.kutumba.ru',
    'https://admin.kutumba.ru',
    'https://api.kutumba.ru',
  ];

  const origin = corsOrigins.length === 0
    ? defaultCorsOrigins
    : corsOrigins.includes('*')
      ? true
      : corsOrigins;

  app.enableCors({
    origin,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
  });

  app.setGlobalPrefix('api');

  app.set('trust proxy', true); // теперь TypeScript не ругается

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
