import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WorkflowService {
  async getPortfolioDetails(userId: string) {
    // Step 1: Fetch User Details
    const user = await axios.get(`http://user-service:3000/user/${userId}`);
    if (!user) throw new Error('User not found');

    // Step 2: Fetch Cryptocurrency Prices
    const cryptoPrices = await axios.get('http://cryptocurrency-service:3001/crypto/prices');

    // Step 3: Fetch Portfolio Details
    const portfolio = await axios.get(`http://portfolio-service:3002/portfolio/${userId}`);

    // Combine all data
    return {
      user: user.data,
      portfolio: portfolio.data,
      cryptoPrices: cryptoPrices.data,
    };
  }
}
