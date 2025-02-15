import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { FCMTokensDto } from './dto/notification.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('fcm')
  @ApiOperation({
    summary: 'Check or register an FCM token for the current user',
  })
  @ApiResponse({
    status: 201,
    description: 'FCM token checked or registered successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid request payload' })
  @ApiBody({ type: FCMTokensDto })
  async checkFCMToken(@Body() body: FCMTokensDto, @Req() req) {
    return this.notificationsService.checkFCMToken(body, req);
  }
}
