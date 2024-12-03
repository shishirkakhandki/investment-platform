import { Module } from '@nestjs/common';
import { CryptocurrencyService } from './cryptocurrency.service';
import { CryptocurrencyController } from './cryptocurrency.controller';

@Module({
  providers: [CryptocurrencyService],
  controllers: [CryptocurrencyController],
  exports: [CryptocurrencyService],
})
export class CryptocurrencyModule {}
