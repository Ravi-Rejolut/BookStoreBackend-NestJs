import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CONSTANT } from './constants/constants';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(CONSTANT.APP_PREFIX)
  app.enableCors({})
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      validateCustomDecorators: true,
    })
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
