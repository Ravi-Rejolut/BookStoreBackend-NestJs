import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { UserRepository } from 'src/user/user.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationRepository } from './notification.repository';
import { AuthRepository } from 'src/auth/auth.repository';
import { OrderRepository } from 'src/order/order.respository';
import { OrderModule } from 'src/order/order.module';
import { BookRepository } from 'src/book/book.repository';


@Module({
  imports:[OrderModule],
  controllers: [NotificationsController],
  providers: [NotificationsService,PrismaService,NotificationRepository,AuthRepository,UserRepository,OrderRepository,BookRepository],
})
export class NotificationsModule {}
