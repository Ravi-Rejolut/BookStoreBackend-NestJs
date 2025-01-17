import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRepository } from 'src/user/user.repository';
import { BookRepository } from 'src/book/book.repository';
import { AuthRepository } from 'src/auth/auth.repository';
import { OrderRepository } from './order.respository';

@Module({
  controllers: [OrderController],
  providers: [OrderService,PrismaService,UserRepository,BookRepository,AuthRepository,OrderRepository],
})
export class OrderModule {}
