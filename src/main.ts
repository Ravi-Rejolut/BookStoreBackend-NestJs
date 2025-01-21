import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CONSTANT } from './constants/constants';
import { ValidationPipe } from '@nestjs/common';
import * as admin from 'firebase-admin'
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  app.setGlobalPrefix(CONSTANT.APP_PREFIX)
  app.enableCors({})
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      validateCustomDecorators: true,
    })
  );

  admin.initializeApp({
    credential: admin.credential.cert({
      clientEmail:configService.get('FIREBASE_CLIENT_EMAIL'),
      privateKey:configService.get('FIREBASE_PRIVATE_KEY'),
      projectId:configService.get('FIREBASE_PROJECT_ID'),
    })
  })
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
