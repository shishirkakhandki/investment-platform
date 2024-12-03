import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { WorkflowController } from './workflow.controller';

@Module({
  imports: [],
  controllers: [WorkflowController],
  providers: [AppService],
})
export class WorkflowModule {}
