import { Injectable, NotFoundException } from '@nestjs/common';

import { UserRepository } from 'src/user/user.repository';
import { FCMTokensDto, OrderNotificationDto } from './dto/notification.dto';
import { AuthRepository } from 'src/auth/auth.repository';
import { MESSAGE } from 'src/constants/messages';
import { CONSTANT } from 'src/constants/constants';
import * as admin from 'firebase-admin';
import { NotificationRepository } from './notification.repository';


@Injectable()
export class NotificationsService {

  constructor(private readonly userRepository: UserRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly authRepository: AuthRepository) { }


  async sendNotificationToTopic(topic: string, title: string, body: string) {

    const res = await admin.messaging().send({ notification: { title, body }, topic });

    return res
  }

  async sendOrderNotificationToUsers(body:OrderNotificationDto)
  {
    try {
      const {orderId,title,message}=body;

      const tokens=await this.notificationRepository.getFCMTokens(orderId)

      const data=admin.messaging().sendEachForMulticast({
        tokens,
        notification: {
          title,
          body: message,
        },
      })

      return true;
      
    } catch (error) {
      throw error;
    }


    


  }
  async checkFCMToken(body: FCMTokensDto, req) {


    const { id: userId } = req.user;
    const { oldFCMToken, newFCMToken } = body;
    const user = this.authRepository.getUser({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(MESSAGE.ERROR.USER.NOT_FOUND);
    }

    let token;

    if (newFCMToken) {
      if (newFCMToken === oldFCMToken) {
        token = await this.handleTokenMatching(userId, newFCMToken)
      }
      else {
        await this.unsubscribeFromTopic(oldFCMToken, CONSTANT.FIREBASE.NOTIFICATION.EVENT_TOPIC);
        token = await this.handleDifferentToken(userId, newFCMToken, oldFCMToken)

      }
      token = await this.subscribeToTopic(newFCMToken, CONSTANT.FIREBASE.NOTIFICATION.EVENT_TOPIC);

    }
    else {
      await this.unsubscribeFromTopic(oldFCMToken, CONSTANT.FIREBASE.NOTIFICATION.EVENT_TOPIC);
      token = await this.removeOldToken(oldFCMToken, userId);
    }

    return token;


  }

  async handleDifferentToken(userId, newToken, oldToken) {
    let resToken = await this.notificationRepository.getFCMToken({ where: { userId, token: oldToken } })

    if (resToken) {
      resToken = await this.notificationRepository.updateFCMToken(userId, newToken, oldToken);

    }
    return resToken;
  }

  async handleTokenMatching(userId: string, token: string) {
    let resToken = await this.notificationRepository.getFCMToken({ where: { userId, token } })
    if (!resToken) {
      resToken = await this.notificationRepository.setFCMToken(userId, token)
    }
    return resToken;

  }

  async removeOldToken(token: string, userId: string) {

    const res = this.notificationRepository.getFCMToken({ where: { userId, token } });
    if (res) {
      await this.notificationRepository.removeFCMToken({ where: { userId, token } });
    }
  }

  async subscribeToTopic(token: string, topic: string) {

    const res = await admin.messaging().subscribeToTopic(token, topic);
    return res;
  }
  async unsubscribeFromTopic(token: string, topic: string) {

    const res = await admin.messaging().unsubscribeFromTopic(token, topic);
    return res

  }



}
