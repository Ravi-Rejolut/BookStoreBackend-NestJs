import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthRepository } from 'src/auth/auth.repository';
import { UserRepository } from './user.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [UserController],
  providers: [UserService,AuthRepository,UserRepository,PrismaService],
})
export class UserModule {}
