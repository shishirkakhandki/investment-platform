import { NestFactory } from '@nestjs/core';
import { CryptocurrencyModule } from './cryptocurrency/cryptocurrency.module';

async function bootstrap() {
  const app = await NestFactory.create(CryptocurrencyModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
