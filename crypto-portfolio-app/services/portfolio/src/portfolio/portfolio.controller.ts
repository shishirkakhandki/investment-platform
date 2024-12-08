import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  // Fetch the portfolio of a user
  @Get(':userId')
  async getPortfolio(@Param('userId') userId: string) {
    return await this.portfolioService.getPortfolio(userId);
  }

  // Fetch the total portfolio value in USD
  @Get(':userId/value')
  async getPortfolioValue(@Param('userId') userId: string) {
    return await this.portfolioService.calculatePortfolioValue(userId);
  }

  // Store or update user portfolio
  @Put(':userId')
  async updatePortfolio(
    @Param('userId') userId: string,
    @Body() data: { walletAddress: string; providerUrl: string; tokenAddresses: string[] }
  ) {
    return await this.portfolioService.updatePortfolio(userId, data.walletAddress, data.providerUrl, data.tokenAddresses);
  }
}
