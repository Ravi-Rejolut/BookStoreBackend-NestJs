import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [UtilsService,JwtService,ConfigService],
  exports:[UtilsService,JwtService,ConfigService]
})
export class UtilsModule {}
