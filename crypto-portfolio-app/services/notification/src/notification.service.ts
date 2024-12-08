import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  getHello(): string {
    return 'Hello World!';
  }

  private subscribers = []; // In-memory for now

  async subscribeToNotifications(userId: string, email: string): Promise<{ message: string }> {
    this.subscribers.push({ userId, email });
    return { message: 'Subscribed successfully' };
  }

}
