import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { CONSTANT } from './constants/constants';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config'
import { UtilsService } from './utils/utils.service';
import { UtilsModule } from './utils/utils.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './interceptor/response.interceptor';
import { BookModule } from './book/book.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: CONSTANT.TOKEN_EXPIRY },
    }), AuthModule, UtilsModule, BookModule],
  controllers: [AppController],
  providers: [AppService, UtilsService,
    
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    }
  ],
})
export class AppModule { }
