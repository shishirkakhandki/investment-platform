import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { WorkflowService } from './workflow.service';

@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Get('portfolio/:userId')
  async getUserPortfolio(@Param('userId') userId: string) {
    try {
      return await this.workflowService.getPortfolioDetails(userId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
