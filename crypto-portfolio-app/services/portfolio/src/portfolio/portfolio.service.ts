import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ethers } from 'ethers';

@Injectable()
export class PortfolioService {
  // Fetch portfolio data from the MetaMask wallet address directly
  async getPortfolio(
    userId: string,
    walletAddress: string,
    providerUrl: string,
    tokenAddresses: string[],
  ) {
    try {
      // Fetch wallet balance and token holdings from MetaMask
      const { ethBalance, holdings } = await this.getWalletBalance(
        walletAddress,
        providerUrl,
        tokenAddresses,
      );

      const portfolio = {
        publicAddress: walletAddress,
        holdings,
        ethBalance,
      };

      return portfolio;
    } catch (error) {
      throw new Error(
        'Error fetching portfolio from MetaMask wallet: ' + error.message,
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
      const portfolio = await this.getPortfolio(
        userId,
        walletAddress,
        providerUrl,
        tokenAddresses,
      );

      let totalValue = 0;

      // Use the USD value directly from the portfolio's holdings
      for (const holding of portfolio.holdings) {
        totalValue += holding.usdValue || 0;
      }

      // Add ETH balance to portfolio value
      return totalValue;
    } catch (error) {
      throw new Error('Error calculating portfolio value: ' + error.message);
    }
  }

  // Get wallet balance and update portfolio with token balances from MetaMask
  async getWalletBalance(
    walletAddress: string,
    providerUrl: string,
    tokenAddresses: string[],
  ) {
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const ethBalance = await this.getEthBalance(walletAddress, provider);

    const holdings = [];
    for (const tokenAddress of tokenAddresses) {
      const tokenBalance = await this.getTokenBalance(
        walletAddress,
        tokenAddress,
        provider,
      );
      holdings.push({
        symbol: tokenAddress, // This should map to the token's symbol after fetching from an API or contract
        amount: tokenBalance,
        token: tokenAddress,
        balance: tokenBalance,
        usdValue: 0, // USD value will be populated after fetching prices
      });
    }

    return { ethBalance, holdings };
  }

  // Fetch current crypto prices
  private async getCryptoPrices(): Promise<any> {
    try {
      const { data } = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin,ripple&vs_currencies=usd',
      );
      return data;
    } catch (error) {
      throw new Error('Error fetching crypto prices: ' + error.message);
    }
  }

  // Get token balance from the contract
  private async getTokenBalance(
    walletAddress: string,
    tokenAddress: string,
    provider: ethers.providers.JsonRpcProvider,
  ): Promise<number> {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ['function balanceOf(address owner) view returns (uint256)'],
      provider,
    );
    const balance = await tokenContract.balanceOf(walletAddress);
    return parseFloat(ethers.utils.formatUnits(balance, 18)); // Assuming 18 decimal places for the token
  }

  // Get Ethereum (ETH) balance from the provider
  private async getEthBalance(
    walletAddress: string,
    provider: ethers.providers.JsonRpcProvider,
  ): Promise<number> {
    const balance = await provider.getBalance(walletAddress);
    return parseFloat(ethers.utils.formatEther(balance));
  }
}
