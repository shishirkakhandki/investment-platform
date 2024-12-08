import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WorkflowService {
  private readonly userServiceUrl = 'http://localhost:3003/user';
  private readonly cryptoServiceUrl = 'http://localhost:3000/crypto';

  async getPortfolioDetails(userId: string) {
    const user = await axios.get(`${this.userServiceUrl}/${userId}`);
    const cryptoPrices = await axios.get(`${this.cryptoServiceUrl}/prices`);
    return { user: user.data, cryptoPrices: cryptoPrices.data };
  }

  async getPortfolioValue(userId: string) {
    const portfolioDetails = await this.getPortfolioDetails(userId);
    // Calculate portfolio value logic
    return { portfolioValue: portfolioDetails };
  }

  async getTopCryptos() {
    const response = await axios.get(`${this.cryptoServiceUrl}/top10`);
    return response.data;
  }

  async signup(body: { username: string; userId: string; password: string }) {
    const response = await axios.post(`${this.userServiceUrl}/signup`, body);
    return response.data;
  }

  async login(body: { userId: string; password: string }) {
    const response = await axios.post(`${this.userServiceUrl}/login`, body);
    return response.data;
  }

  async updatePassword(body: { userId: string; oldPassword: string; newPassword: string }) {
    const response = await axios.post(`${this.userServiceUrl}/password`, body);
    return response.data;
  }
}
