import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get(':userId')
  async getPortfolio(@Param('userId') userId: string): Promise<any> {
    // Fetch and return portfolio for the user.
  }

  @Post(':userId')
  async updatePortfolio(@Param('userId') userId: string, @Body() body: any): Promise<void> {
    // Update user portfolio.
  }
}
