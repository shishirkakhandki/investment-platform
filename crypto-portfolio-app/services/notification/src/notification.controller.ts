import { Body, Controller, Get, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getHello(): string {
    return this.notificationService.getHello();
  }

  @Post('subscribe')
  async subscribe(@Body() body: { userId: string; email: string }) {
    return await this.notificationService.subscribeToNotifications(body.userId, body.email);
  }

}
