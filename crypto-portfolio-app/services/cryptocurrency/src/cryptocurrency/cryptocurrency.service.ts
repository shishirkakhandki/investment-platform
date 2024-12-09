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
      throw new Error('Error fetching cryptocurrency prices: ' + error);
    }
  }

  private readonly BASE_URL = 'https://api.coingecko.com/api/v3';

  // Fetch the top 10 cryptocurrencies by market cap
  async getTop10Cryptocurrencies(): Promise<any> {
    try {
      const { data } = await axios.get(`${this.BASE_URL}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 10,
          page: 1,
        },
      });

      // Extract relevant fields for frontend
      return data.map((crypto) => ({
        id: crypto.id,
        name: crypto.name,
        symbol: crypto.symbol.toUpperCase(),
        current_price: crypto.current_price,
        market_cap: crypto.market_cap,
        price_change_percentage_24h: crypto.price_change_percentage_24h,
      }));
    } catch (error) {
      console.error('Error fetching top cryptocurrencies:', error.message);
      throw new Error('Unable to fetch top cryptocurrencies at this time.');
    }
  }

  async getHistoricalPrices(symbol: string, range: string): Promise<any> {
    try {
      if (!symbol || !range) {
        throw new Error('Symbol and range are required.');
      }

      const { data } = await axios.get(
        `${this.BASE_URL}/coins/${symbol}/market_chart`,
        { params: { vs_currency: 'usd', days: range } },
      );

      return data.prices.map(([timestamp, price]) => ({
        timestamp,
        price,
      }));
    } catch (error) {
      if (error.response) {
        console.error('API Error:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
      throw new Error('Unable to fetch historical prices at this time.');
    }
  }
}
