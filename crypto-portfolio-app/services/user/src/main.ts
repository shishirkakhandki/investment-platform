import { NestFactory } from '@nestjs/core';
import { UserModule } from './user/user.module';


async function bootstrap() {
  try {
    const app = await NestFactory.create(UserModule);
    await app.init();
    await app.listen(3003);
    console.log('Application is running on port 3003');
  } catch (error) {
    console.error('Failed to start the application:', error);
    process.exit(1);
  }
}

// Handle any unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

bootstrap().catch(error => {
  console.error('Bootstrap error:', error);
  process.exit(1);
});