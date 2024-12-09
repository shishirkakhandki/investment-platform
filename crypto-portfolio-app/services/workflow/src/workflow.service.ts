import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WorkflowService {
  private readonly userServiceUrl = 'http://localhost:3003/user';
  private readonly cryptoServiceUrl = 'http://localhost:3000/crypto';
  private readonly portfolioServiceUrl = 'http://localhost:3002/portfolio';

  async getPortfolioDetails(
    userId: string,
    walletAddress: string,
    providerUrl: string,
    tokenAddresses: string[],
  ) {
    try {
      // Construct the URL for the portfolio service
      const queryParams = new URLSearchParams();
      queryParams.append('walletAddress', walletAddress);
      queryParams.append('providerUrl', providerUrl); // Avoid double encoding
      tokenAddresses.forEach((address) => queryParams.append('tokenAddresses', address)); // Or use .join(',') if needed
  
      const portfolioUrl = `${this.portfolioServiceUrl}/${userId}?${queryParams.toString()}`;
      console.log(`Constructed URL: ${portfolioUrl}`);
  
      // Make the GET request directly to the portfolio service
      const response = await axios.get(portfolioUrl);
      return response.data; // Return the data from the portfolio service
    } catch (error) {
      console.error('Error in WorkflowService:', error.message);
      throw new HttpException(
        error.response?.data?.message || 'Failed to fetch portfolio details',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async calculatePortfolioValue(
    userId: string,
    walletAddress: string,
    providerUrl: string,
    tokenAddresses: string[],
  ): Promise<number> {
    try {
      // Construct the URL for the portfolio service with query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('walletAddress', walletAddress);
      queryParams.append('providerUrl', providerUrl);
      tokenAddresses.forEach((address) => queryParams.append('tokenAddresses', address));

      const portfolioValueUrl = `${this.portfolioServiceUrl}/${userId}/value?${queryParams.toString()}`;
      console.log(`Constructed URL for portfolio value: ${portfolioValueUrl}`);

      // Fetch portfolio value from PortfolioService
      const response = await axios.get(portfolioValueUrl);
      return response.data; // Return portfolio value from PortfolioService
    } catch (error) {
      console.error('Error in WorkflowService (calculatePortfolioValue):', error.message);
      throw new HttpException(
        error.response?.data?.message || 'Failed to calculate portfolio value',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  

  async getTopCryptos() {
    try {
      const response = await axios.get(`${this.cryptoServiceUrl}/top10`);
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch top cryptocurrencies',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signup(body: { username: string; userId: string; password: string }) {
    try {
      const response = await axios.post(`${this.userServiceUrl}/signup`, body);
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to sign up user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(body: { userId: string; password: string }) {
    try {
      const response = await axios.post(`${this.userServiceUrl}/login`, body);
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to log in user',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async updatePassword(body: { userId: string; oldPassword: string; newPassword: string }) {
    try {
      const response = await axios.post(`${this.userServiceUrl}/password`, body);
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to update password',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
