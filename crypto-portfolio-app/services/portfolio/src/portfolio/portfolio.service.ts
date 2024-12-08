import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ethers} from 'ethers';

@Injectable()
export class PortfolioService {
  // In-memory storage for portfolios (can be replaced with a DB in the future)
  private portfolios = new Map<string, any>();

  // Fetch the user's portfolio with current USD values
  async getPortfolio(userId: string) {
    const portfolio = this.portfolios.get(userId);
    if (!portfolio) {
      throw new Error('Portfolio not found for the given user');
    }
    return portfolio;
  }

  // Calculate the total portfolio value in USD
  async calculatePortfolioValue(userId: string): Promise<number> {
    const portfolio = await this.getPortfolio(userId);
    const prices = await this.getCryptoPrices();

    let totalValue = 0;
    for (const holding of portfolio.holdings) {
      const price = prices[holding.symbol]?.usd || 0;
      totalValue += holding.amount * price;
    }
    return totalValue;
  }

  // Fetch the current crypto prices (BTC and ETH) from CoinGecko API
  private async getCryptoPrices(): Promise<any> {
    try {
      const { data } = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd',
      );
      return {
        BTC: data.bitcoin,
        ETH: data.ethereum,
      };
    } catch (error) {
      throw new Error('Error fetching crypto prices');
    }
  }

  // Fetch the balance of a specific ERC-20 token from MetaMask wallet
  private async getTokenBalance(walletAddress: string, tokenAddress: string, provider: ethers.providers.JsonRpcProvider): Promise<number> {
    const tokenContract = new ethers.Contract(tokenAddress, [
      "function balanceOf(address owner) view returns (uint256)"
    ], provider);
    const balance = await tokenContract.balanceOf(walletAddress);
    return parseFloat(ethers.utils.formatUnits(balance, 18)); // Assuming 18 decimal places for the token
  }

  // Fetch the Ethereum (ETH) balance from MetaMask wallet
  private async getEthBalance(walletAddress: string, provider: ethers.providers.JsonRpcProvider): Promise<number> {
    const balance = await provider.getBalance(walletAddress);
    return parseFloat(ethers.utils.formatEther(balance));
  }

  // Store or update the user's portfolio based on their MetaMask data
  async updatePortfolio(userId: string, walletAddress: string, providerUrl: string, tokenAddresses: string[]) {
    // Initialize provider (using Infura, Alchemy, or any other Ethereum node provider)
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);

    // Fetch Ethereum balance
    const ethBalance = await this.getEthBalance(walletAddress, provider);

    // Fetch ERC-20 token balances
    const holdings = [];
    for (const tokenAddress of tokenAddresses) {
      const tokenBalance = await this.getTokenBalance(walletAddress, tokenAddress, provider);
      holdings.push({
        symbol: tokenAddress, // You may want to map this to the token's symbol, e.g., "BTC"
        amount: tokenBalance,
        token: tokenAddress,
        balance: tokenBalance,
        usdValue: 0, // USD value will be populated after fetching prices
      });
    }

    // Store portfolio data
    const portfolio = {
      publicAddress: walletAddress,
      holdings,
    };

    this.portfolios.set(userId, portfolio);
    return { message: 'Portfolio updated successfully' };
  }
}
