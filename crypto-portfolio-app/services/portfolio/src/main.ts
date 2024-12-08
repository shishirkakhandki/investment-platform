import { NestFactory } from '@nestjs/core';
import { PortfolioModule } from './portfolio/portfolio.module';

async function bootstrap() {
  const app = await NestFactory.create(PortfolioModule);
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
