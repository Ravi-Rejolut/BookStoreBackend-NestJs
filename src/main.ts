import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CONSTANT } from './constants/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(CONSTANT.APP_PREFIX)
  app.enableCors({})
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
