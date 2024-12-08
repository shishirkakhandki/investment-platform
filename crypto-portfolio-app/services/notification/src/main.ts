import { NestFactory } from '@nestjs/core';
import { AppModule } from './notification.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
