import { Controller, Get, Query } from '@nestjs/common';
import { CryptocurrencyService } from './cryptocurrency.service';

@Controller('crypto')
export class CryptocurrencyController {
  constructor(private readonly cryptoService: CryptocurrencyService) {}

  // Endpoint to fetch the top 10 cryptocurrencies by market cap
  @Get('top10')
  async getTop10Cryptocurrencies(): Promise<any> {
    return await this.cryptoService.getTop10Cryptocurrencies();
  }

  // Endpoint to fetch the current prices of specific cryptocurrencies
  @Get('prices')
  async getPrices(): Promise<any> {
    return await this.cryptoService.getCryptoPrices();
  }

  // Endpoint to fetch historical prices for a given symbol and range
  @Get('historical')
  async getHistoricalPrices(
    @Query('symbol') symbol: string,
    @Query('range') range: string,
  ) {
    return await this.cryptoService.getHistoricalPrices(symbol, range);
  }
}
