import { Controller, Get } from '@nestjs/common';
import { CryptocurrencyService } from './cryptocurrency.service';

@Controller('crypto')
export class CryptocurrencyController {
  constructor(private readonly cryptoService: CryptocurrencyService) {}

  @Get('prices')
  async getPrices(): Promise<any> {
    return await this.cryptoService.getCryptoPrices();
  }
}
