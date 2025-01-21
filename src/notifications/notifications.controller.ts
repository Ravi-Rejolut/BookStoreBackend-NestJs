import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { FCMTokensDto } from './dto/notification.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}


  @Post("fcm")
  async checkFCMToken(@Body() body:FCMTokensDto,@Req() req){

    return this.notificationsService.checkFCMToken(body,req)
    
  }
}
