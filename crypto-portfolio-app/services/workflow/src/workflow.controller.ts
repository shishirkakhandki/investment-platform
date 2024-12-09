import { Controller, Get, Post, Body, Param, HttpException, HttpStatus, Query } from '@nestjs/common';
import { WorkflowService } from './workflow.service';

@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Get('portfolio/:userId')
  async getUserPortfolio(
    @Param('userId') userId: string,
    @Query('walletAddress') walletAddress: string,
    @Query('providerUrl') providerUrl: string,
    @Query('tokenAddresses') tokenAddresses: string[],
  ) {
    console.log(`Received request for user ${userId}`);
    console.log(`Wallet Address: ${walletAddress}`);
    console.log(`Provider URL: ${providerUrl}`);
    console.log(`Token Addresses: ${tokenAddresses}`);
    try {
      return await this.workflowService.getPortfolioDetails(userId, walletAddress, providerUrl, tokenAddresses);
    } catch (error) {
      console.error('Error in WorkflowController:', error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // New method for fetching portfolio value
  @Get('portfolio/:userId/value')
  async getPortfolioValue(
    @Param('userId') userId: string,
    @Query('walletAddress') walletAddress: string,
    @Query('providerUrl') providerUrl: string,
    @Query('tokenAddresses') tokenAddresses: string[],
  ) {
    try {
      return await this.workflowService.calculatePortfolioValue(userId, walletAddress, providerUrl, tokenAddresses);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('crypto/top10')
  async getTopCryptos() {
    try {
      const ans =  await this.workflowService.getTopCryptos();
      return { data: ans };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('signup')
  async signup(@Body() body: { username: string; userId: string; password: string }) {
    try {
      return await this.workflowService.signup(body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
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


  @Get('crypto/historical')
  async getCryptoHistory(
    @Query('symbol') symbol: string,
    @Query('range') range: string,
  ) {
    console.log(`Received request for historical data: symbol=${symbol}, range=${range}`);
    try {
      return await this.workflowService.getCryptoHistory(symbol, range);
    } catch (error) {
      console.error('Error in WorkflowController (getCryptoHistory):', error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
