import { Controller, Get, Param, Query } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  // Endpoint to fetch the portfolio using userId, walletAddress, providerUrl, and tokenAddresses
  @Get(':userId')
  async getPortfolio(
    @Param('userId') userId: string,
    @Query('walletAddress') walletAddress: string,
    @Query('providerUrl') providerUrl: string,
    @Query('tokenAddresses') tokenAddresses: string[],
  ) {
    console.log("User id: "+userId+" walletAddress: "+walletAddress+" providerUrl: "+providerUrl+" tokenAddresses: "+tokenAddresses)
    return await this.portfolioService.getPortfolio(userId, walletAddress, providerUrl, tokenAddresses);
  }
  
  // Endpoint to calculate portfolio value using the same parameters
  @Get(':userId/value')
  async getPortfolioValue(
    @Param('userId') userId: string,
    @Query('walletAddress') walletAddress: string,
    @Query('providerUrl') providerUrl: string,
    @Query('tokenAddresses') tokenAddresses: string[],
  ) {
    return await this.portfolioService.calculatePortfolioValue(userId, walletAddress, providerUrl, tokenAddresses);
  }
}
