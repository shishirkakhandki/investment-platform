import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CryptocurrencyService {
  async getCryptoPrices(): Promise<any> {
    try {
      const { data } = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd',
      );
      return data;
    } catch (error) {
      throw new Error('Error fetching cryptocurrency prices');
    }
  }
}
