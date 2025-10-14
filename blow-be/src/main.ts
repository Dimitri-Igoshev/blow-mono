import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 🔓 Разрешаем CORS с любого домена (включая credentials)
  app.enableCors({
    // origin: true — отражает Origin из запроса (не ставит '*'),
    // что совместимо с credentials: true
    origin: (origin, callback) => callback(null, true),
    credentials: true,
    // Остальное можно не указывать — cors выставит дефолт:
    // methods: ['GET','HEAD','PUT','PATCH','POST','DELETE']
    // allowedHeaders — возьмутся из preflight-запроса
  });

  app.setGlobalPrefix('api');
  app.set('trust proxy', true);

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { NestExpressApplication } from '@nestjs/platform-express';

// async function bootstrap() {
//   const app = await NestFactory.create<NestExpressApplication>(AppModule);

//   const corsOrigins = (process.env.CORS_ORIGINS ?? '')
//     .split(',')
//     .map((origin) => origin.trim())
//     .filter(Boolean);

//   const defaultCorsOrigins = [
//     'http://localhost:3000',
//     'https://blow.ru',
//     'https://www.blow.ru',
//     'https://admin.blow.ru',
//     'https://api.blow.ru',
//   ];

//   const origin = corsOrigins.length === 0
//     ? defaultCorsOrigins
//     : corsOrigins.includes('*')
//       ? true
//       : corsOrigins;

//   app.enableCors({
//     origin,
//     credentials: true,
//     methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
//     allowedHeaders: [
//       'Content-Type',
//       'Authorization',
//       'Accept',
//       'Origin',
//       'X-Requested-With',
//     ],
//   });

//   app.setGlobalPrefix('api');

//   app.set('trust proxy', true); // теперь TypeScript не ругается

//   await app.listen(process.env.PORT ?? 4000);
// }
// bootstrap();
