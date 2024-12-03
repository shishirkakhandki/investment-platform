import { NestFactory } from '@nestjs/core';
import { WorkflowModule } from './workflow.module';

async function bootstrap() {
  const app = await NestFactory.create(WorkflowModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
