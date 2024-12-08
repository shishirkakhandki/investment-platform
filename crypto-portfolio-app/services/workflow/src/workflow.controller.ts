import { Controller, Get, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
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

  @Get('portfolio/:userId/value')
  async getCombinedPortfolioValue(@Param('userId') userId: string) {
    return await this.workflowService.getPortfolioValue(userId);
  }

  @Get('crypto/top10')
  async getTopCryptos() {
    try {
      return await this.workflowService.getTopCryptos();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('signup')
  async signup(@Body() body: { username: string; userId: string; password: string }) {
    try {
      return await this.workflowService.signup(body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  async login(@Body() body: { userId: string; password: string }) {
    try {
      return await this.workflowService.login(body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('password')
  async updatePassword(
    @Body() body: { userId: string; oldPassword: string; newPassword: string },
  ) {
    try {
      return await this.workflowService.updatePassword(body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
