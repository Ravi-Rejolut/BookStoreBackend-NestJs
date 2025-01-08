import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRepository } from './auth.repository';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports:[UtilsModule],
  controllers: [AuthController],
  providers: [AuthService,PrismaService,AuthRepository],
})
export class AuthModule {}
