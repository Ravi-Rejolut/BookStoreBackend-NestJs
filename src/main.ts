import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CONSTANT } from './constants/constants';
import { ValidationPipe } from '@nestjs/common';
import * as admin from 'firebase-admin'
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

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

  const config = new DocumentBuilder()
    .setTitle('Book API Documentation')
    .setDescription('The Book API provides a comprehensive set of endpoints for managing books, categories, authors, and users in a book management system. This API supports the ability to perform CRUD operations on books, handle user authentication, and manage categories and authors. It is designed to be scalable, secure, and easy to integrate with various client applications. ')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const outputPath = './swagger.json'; // Path to save the JSON file
  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2)); // Save with pretty formatting
  console.log(`Swagger JSON saved to ${outputPath}`);

  admin.initializeApp({
    credential: admin.credential.cert({
      clientEmail: configService.get('FIREBASE_CLIENT_EMAIL'),
      privateKey: configService.get('FIREBASE_PRIVATE_KEY'),
      projectId: configService.get('FIREBASE_PROJECT_ID'),
    })
  })
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
