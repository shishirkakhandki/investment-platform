import { NestFactory } from '@nestjs/core';
import { WorkflowModule } from './workflow.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(WorkflowModule);

  // Enable CORS
  const corsOptions: CorsOptions = {
    origin: '*', // or specify allowed origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  };

  app.enableCors(corsOptions);

  await app.listen(3004); // Ensure the correct port is used
}

bootstrap();
